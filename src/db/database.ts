import * as SQLite from 'expo-sqlite';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
import { addRxPlugin, createRxDatabase, removeRxDatabase, RxDatabase } from 'rxdb';
import { RxDBEncryptionPlugin } from 'rxdb/plugins/encryption';
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { FactCollection, factCollectionMethods, factDocumentMethods, factSchema } from './fact/model';
import { generateIsoDate } from './helpers';
import { ScheduleCollection, scheduleCollectionMethods, scheduleSchema } from './schedule/model';
import { TagCollection, tagCollectionMethods, tagSchema } from './tag/model';

const DB_NAME = 'memorize-facts-db';

export type MemorizeFactsDatabaseCollections = {
  tags: TagCollection;
  facts: FactCollection;
  schedules: ScheduleCollection;
};

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);

addPouchPlugin(SQLiteAdapter);
// eslint-disable-next-line @typescript-eslint/no-var-requires
addPouchPlugin(require('pouchdb-adapter-http'));
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBReplicationGraphQLPlugin);
addRxPlugin(RxDBEncryptionPlugin);

const storage = getRxStoragePouch('react-native-sqlite');

const isDevelopment = process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

let database: RxDatabase;

export async function initialize(databaseInstance: RxDatabase): Promise<RxDatabase> {
  console.log('isDevelopment', isDevelopment);

  if (isDevelopment) {
    try {
      if (process.env.DEBUG_PROD !== 'true') {
        if (databaseInstance) {
          return databaseInstance;
        }
        await removeRxDatabase(DB_NAME, storage);
      }
      const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
      addRxPlugin(RxDBDevModePlugin);
    } catch (e) {
      console.warn(e);
    }
  }

  try {
    if (!database) {
      database = await createRxDatabase({
        name: 'memorize-facts-db',
        storage,
        multiInstance: false, // must be false for react-native
      });
    }
  } catch (err) {
    console.warn('ERROR CREATING DATABASE', err);
  }

  try {
    await database.addCollections<MemorizeFactsDatabaseCollections>({
      tags: {
        schema: tagSchema,
        statics: tagCollectionMethods,
      },
      facts: {
        schema: factSchema,
        methods: factDocumentMethods,
        statics: factCollectionMethods,
      },
      schedules: {
        schema: scheduleSchema,
        statics: scheduleCollectionMethods,
      },
    });
  } catch (err) {
    console.warn('ERROR CREATING COLLECTIONS', err);
  }

  try {
    database.tags.preSave(async (doc) => {
      doc.updatedAt = generateIsoDate();
    }, false);

    if (isDevelopment) {
      database.$.subscribe((changeEvent) => console.log(changeEvent)); // turn on logging via observable
    }
  } catch (err) {
    console.warn('ERROR RUNNING POST INIT DB ACTIONS', err);
  }

  return database;
}

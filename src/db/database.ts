import * as SQLite from 'expo-sqlite';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
import { addRxPlugin, createRxDatabase, removeRxDatabase, RxDatabase } from 'rxdb';
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { FactCollection, factCollectionMethods, factDocumentMethods, factSchema } from './fact/model';
import { HeroCollection, heroSchema } from './hero/model';
import { TagCollection, tagCollectionMethods, tagSchema } from './tag/model';

const DB_NAME = 'memorize-facts-db';

export type MemorizeFactsDatabaseCollections = {
  heroes: HeroCollection;
  tags: TagCollection;
  facts: FactCollection;
};

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);

addPouchPlugin(SQLiteAdapter);
// eslint-disable-next-line @typescript-eslint/no-var-requires
addPouchPlugin(require('pouchdb-adapter-http'));
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

const storage = getRxStoragePouch('react-native-sqlite');

const isDevelopment = process.env.NODE_ENV !== 'prod' || process.env.DEBUG_PROD === 'true';

let database: RxDatabase;

export async function initialize(databaseInstance: RxDatabase): Promise<RxDatabase> {
  console.log('isDevelopment', isDevelopment);
  if (databaseInstance) {
    return databaseInstance;
  }

  if (isDevelopment) {
    try {
      await removeRxDatabase(DB_NAME, storage);
      const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
      addRxPlugin(RxDBDevModePlugin);
    } catch (e) {
      console.error(e);
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
    console.error('ERROR CREATING DATABASE', err);
  }

  try {
    await database.addCollections<MemorizeFactsDatabaseCollections>({
      heroes: {
        schema: heroSchema,
        //methods: heroDocMethods,
        //statics: heroCollectionMethods,
      },
      tags: {
        schema: tagSchema,
        //methods: tagCollectionMethods,
        statics: tagCollectionMethods,
      },
      facts: {
        schema: factSchema,
        methods: factDocumentMethods,
        statics: factCollectionMethods,
      },
    });
  } catch (err) {
    console.error('ERROR CREATING COLLECTIONS', err);
  }

  try {
    if (isDevelopment) {
      database.$.subscribe((changeEvent) => console.log(changeEvent)); // turn on logging via observable
    }
  } catch (err) {
    console.error('ERROR RUNNING POST INIT DB ACTIONS', err);
  }

  return database;
}

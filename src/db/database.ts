import { addRxPlugin, createRxDatabase, removeRxDatabase, RxDatabase } from 'rxdb';
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb';
import * as SQLite from 'expo-sqlite';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
import { Hero, HeroCollection, HeroDocument, heroSchema } from './hero/model';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';

const DB_NAME = 'memorize-facts-db';

type MemorizeFactsDatabaseCollections = {
  heroes: HeroCollection;
};

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);

addPouchPlugin(SQLiteAdapter);
addPouchPlugin(require('pouchdb-adapter-http'));
addRxPlugin(RxDBQueryBuilderPlugin);

const storage = getRxStoragePouch('react-native-sqlite');

const isDevelopment = process.env.NODE_ENV !== 'prod' || process.env.DEBUG_PROD === 'true';

let database: RxDatabase;

export async function initialize(databaseInstance: RxDatabase): Promise<RxDatabase> {
  if (databaseInstance) {
    return databaseInstance;
  }

  if (isDevelopment) {
    try {
      await removeRxDatabase(DB_NAME, storage);
      const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
      addRxPlugin(RxDBDevModePlugin);
    } catch (e) {
      console.log(e);
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
    console.log('ERROR CREATING DATABASE', err);
  }

  try {
    await database.addCollections({
      heroes: {
        schema: heroSchema,
        //methods: heroDocMethods,
        //statics: heroCollectionMethods,
      },
    });
  } catch (err) {
    console.log('ERROR CREATING COLLECTIONS', err);
  }

  try {
    if (isDevelopment) {
      database.$.subscribe((changeEvent) => console.log(changeEvent)); // turn on logging via observable
    }
  } catch (err) {
    console.log('ERROR RUNNING POST INIT DB ACTIONS', err);
  }

  return database;
}

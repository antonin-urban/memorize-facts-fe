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

const isDevelopment = process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

export async function initializeDb(): Promise<RxDatabase> {
  let database: RxDatabase;

  if (isDevelopment) {
    await removeRxDatabase(DB_NAME, storage);
    const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
    addRxPlugin(RxDBDevModePlugin);
  }

  try {
    console.log('Initializing local database...');

    database = await createRxDatabase({
      name: 'memorize-facts-db',
      storage,
      multiInstance: false,
    });

    console.log('Local database initialized!');
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  try {
    console.log('Adding collections to database...');

    await database.addCollections({
      heroes: {
        schema: heroSchema,
        //methods: heroDocMethods,
        //statics: heroCollectionMethods,
      },
    });

    console.log('Collections added...');
  } catch (err) {
    console.log('ERROR CREATING COLLECTIONS', err);
  }

  try {
    console.log('Running db post init actions');

    // add a postInsert-hook
    database.heroes.postInsert(
      function myPostInsertHook(
        this: HeroCollection, // own collection is bound to the scope
        docData: HeroDocument, // documents data
        doc: Hero, // RxDocument
      ) {
        console.log('insert to ' + this.name + '-collection: ' + doc.firstName);
      },
      false, // not async
    );

    console.log('Post init db actions executed...');
  } catch (err) {
    console.log('ERROR RUNNING POST INIT DB ACTIONS', err);
  }

  return database;
}

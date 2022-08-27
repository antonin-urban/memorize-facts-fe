import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache } from 'apollo3-cache-persist';
import React, { useState, useEffect } from 'react';
import { RxDatabase } from 'rxdb';
import { AppContext } from './components/AppContext';
import RootTabNavigatior from './components/navigations/RootNavigator';
import { initialize, MemorizeFactsDatabaseCollections } from './db/database';
import { handleReplicationError } from './db/helpers';
import { checkSyncStatusInSecureStore } from './db/secureStore';
import { GQL_SERVER_URL } from './graphql/constants';
import { syncOptionsGraphQL } from './graphql/tag/replication';

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: GQL_SERVER_URL,
  cache,
  defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } },
});

function App(): React.ReactElement {
  const [db, setDb] = useState(null);
  const [syncStatus, setSyncStatus] = useState(false);
  const [tagReplicationState, setTagReplicationState] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const _db = await initialize(db);
      setDb(_db);
    };
    initDB().then();
  }, []);

  useEffect(() => {
    persistCache({
      cache,
      storage: AsyncStorage,
    });
  }, []);

  useEffect(() => {
    const innitSyncStatus = async () => {
      (await checkSyncStatusInSecureStore()) ? setSyncStatus(true) : setSyncStatus(false);
    };
    innitSyncStatus().then();
  }, []);

  useEffect(() => {
    console.warn('syncStatus', syncStatus);

    if (db && syncStatus) {
      try {
        // tag replication
        const tagReplicationStateInner = (db as RxDatabase<MemorizeFactsDatabaseCollections>).tags.syncGraphQL(
          syncOptionsGraphQL,
        );

        // handle errors
        tagReplicationStateInner.error$.subscribe(handleReplicationError);

        // set replication state
        setTagReplicationState(tagReplicationStateInner);
      } catch (e) {
        console.error(e);
      }
    } else if (db && syncStatus === false && tagReplicationState) {
      // cancel existing replication
      tagReplicationState.cancel();
    }
  }, [db, syncStatus]);

  return (
    <ApolloProvider client={client}>
      <AppContext.Provider value={{ db, syncStatus, setSyncStatus }}>
        <RootTabNavigatior />
      </AppContext.Provider>
    </ApolloProvider>
  );
}

export default App;

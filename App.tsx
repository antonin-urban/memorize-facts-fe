// for this first import see https://github.com/uuidjs/uuid/issues/416
import 'react-native-get-random-values';
import { decode, encode } from 'base-64';
import { useState, useEffect } from 'react';
import { AppContext } from './src/appContext';
import { initializeDb } from './src/db/initializeDb';
import Heroes from './Hereos';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

// Avoid using node dependent modules
process.browser = true;

export default function App() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const _db = await initializeDb();
      setDb(_db);
    };
    initDB().then();
  }, []);

  return (
    <AppContext.Provider value={{ db }}>
      <Heroes />
    </AppContext.Provider>
  );
}

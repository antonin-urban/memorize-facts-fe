// for this first import see https://github.com/uuidjs/uuid/issues/416
import 'react-native-get-random-values';
import { decode, encode } from 'base-64';
import { useState, useEffect } from 'react';
import { AppContext } from './src/components/AppContext';
import { initialize } from './src/db/database';
import Heroes from './src/screens/Hereos';

// RxDB polyfill to make it work with older browsers
if (!global.btoa) {
  global.btoa = encode;
}

// RxDB polyfill to make it work with older browsers
if (!global.atob) {
  global.atob = decode;
}

// RxDB polyfill to make it work with older browsers
// Avoid using node dependent modules
process.browser = true;

export default function App() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const _db = await initialize();
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

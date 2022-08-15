import 'react-native-get-random-values';
import { useState, useEffect } from 'react';
import { AppContext } from './src/appContext';
import { initializeDb } from './src/db/initializeDb';
import Heroes from './Hereos';

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

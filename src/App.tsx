import { useState, useEffect } from 'react';
import { AppContext } from './components/AppContext';
import RootStack from './components/navigations/RootStack';
import { initialize } from './db/database';

function App(): React.ReactElement {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const _db = await initialize(db);
      setDb(_db);
    };
    initDB().then();
  }, []);

  return (
    <AppContext.Provider value={{ db }}>
      <RootStack />
    </AppContext.Provider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { AppContext } from './components/AppContext';
import RootTabNavigatior from './components/navigations/RootTabNavigator';
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
      <RootTabNavigatior />
    </AppContext.Provider>
  );
}

export default App;

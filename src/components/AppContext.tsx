import { createContext } from 'react';
import { RxDatabase } from 'rxdb';
import { MemorizeFactsDatabaseCollections } from '../db/database';

type AppContextType = {
  db: RxDatabase<MemorizeFactsDatabaseCollections>;
};

export const AppContext = createContext<AppContextType>({
  db: null,
});

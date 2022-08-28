import { createContext } from 'react';
import { RxDatabase } from 'rxdb';
import { MemorizeFactsDatabaseCollections } from '../db/database';

export type AppContextType = {
  db: RxDatabase<MemorizeFactsDatabaseCollections>;
  syncStatus: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setSyncStatus: (syncOn: boolean) => void;
};

export const AppContext = createContext<AppContextType>({
  db: null,
  syncStatus: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSyncStatus: null,
});

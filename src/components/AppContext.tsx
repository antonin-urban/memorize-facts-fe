import { createContext } from 'react';
import { RxDatabase } from 'rxdb';

type AppContextType = {
  db: RxDatabase;
};

export const AppContext = createContext<AppContextType>({
  db: null,
});

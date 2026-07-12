import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import type { Units } from '../components/Footer';

type UnitsState = Units | undefined;

export type UnitsContextType = {
  units: UnitsState;
  setUnits: Dispatch<SetStateAction<UnitsState>>;
};

export const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const UnitsContextProvider = ({ children }: { children: ReactNode }) => {
  const [units, setUnits] = useState<UnitsState>(undefined);

  return (
    <UnitsContext.Provider value={{ units, setUnits }}>{children}</UnitsContext.Provider>
  );
};

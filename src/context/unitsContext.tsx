import { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import { UnitsInterface } from '../utilities/interfaces';

type UnitsStateType = UnitsInterface | undefined;

export type UnitsContextType = {
  units: UnitsStateType;
  setUnits: Dispatch<SetStateAction<UnitsStateType>>;
};

export const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const UnitsContextProvider = ({ children }: { children: ReactNode }) => {
  const [units, setUnits] = useState<UnitsStateType>(undefined);

  return (
    <UnitsContext.Provider value={{ units, setUnits }}>{children}</UnitsContext.Provider>
  );
};

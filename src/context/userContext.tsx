import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import type { User } from 'firebase/auth';

type UserStateType = User | { uid: undefined };

export type UserContextType = {
  user: UserStateType;
  setUser: Dispatch<SetStateAction<UserStateType>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserStateType>({ uid: undefined });

  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};

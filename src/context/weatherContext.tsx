import { createContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import { WeatherDataInterface } from '../utilities/interfaces';

type WeatherStateType = WeatherDataInterface | undefined | null;

export type WeatherContextType = {
  weatherData: WeatherStateType;
  setWeatherData: Dispatch<SetStateAction<WeatherStateType>>;
};

export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherContextProvider = ({ children }: { children: ReactNode }) => {
  const [weatherData, setWeatherData] = useState<WeatherStateType>(undefined);

  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData }}>
      {children}
    </WeatherContext.Provider>
  );
};

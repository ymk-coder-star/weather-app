import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useCallback, useRef, useState } from 'react';
import type { WeatherData } from '../utilities/weatherSchema&Type';

type WeatherStateType = WeatherData | undefined | null;

export type WeatherContextType = {
  weatherData: WeatherStateType;
  setWeatherData: Dispatch<SetStateAction<WeatherStateType>>;
  beginWeatherRequest: () => number;
  completeWeatherRequest: (requestId: number, data: WeatherStateType) => boolean;
  isWeatherRequestCurrent: (requestId: number) => boolean;
};

export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherContextProvider = ({ children }: { children: ReactNode }) => {
  const [weatherData, setWeatherDataState] = useState<WeatherStateType>(undefined);
  const requestIdRef = useRef(0);

  const setWeatherData: Dispatch<SetStateAction<WeatherStateType>> = useCallback(
    (value) => {
      requestIdRef.current += 1;
      setWeatherDataState(value);
    },
    []
  );

  const beginWeatherRequest = useCallback(() => {
    requestIdRef.current += 1;
    return requestIdRef.current;
  }, []);

  const completeWeatherRequest = useCallback(
    (requestId: number, data: WeatherStateType) => {
      if (requestId !== requestIdRef.current) return false;
      setWeatherDataState(data);
      return true;
    },
    []
  );

  const isWeatherRequestCurrent = useCallback(
    (requestId: number) => requestId === requestIdRef.current,
    []
  );

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
        beginWeatherRequest,
        completeWeatherRequest,
        isWeatherRequestCurrent,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

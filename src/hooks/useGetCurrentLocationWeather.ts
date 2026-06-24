import { useWeatherAPI } from './useWeatherAPI';
import { useCustomContext } from './useCustomContext';
import { WeatherContextType } from '../context/weatherContext';
import { useCallback } from 'react';

export function useGetCurrentLocationWeather() {
  const { fetchWeather } = useWeatherAPI();
  const { setWeatherData } = useCustomContext<WeatherContextType>('WeatherContext');

  const setWeatherFromCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude }: { latitude: number; longitude: number } =
        position.coords;

      const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const weatherData = await fetchWeather({ latitude, longitude, timezone });

      setWeatherData(weatherData);
    });
  }, [fetchWeather, setWeatherData]);

  return { setWeatherFromCurrentLocation };
}

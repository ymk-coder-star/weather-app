import { useCallback } from 'react';
import { useWeatherAPI } from './useWeatherAPI';
import { useCustomContext } from './useCustomContext';
import type { WeatherContextType } from '../context/weatherContext';

export function useGetCurrentLocationWeather() {
  const { fetchWeather } = useWeatherAPI();
  const { setWeatherData } = useCustomContext<WeatherContextType>('WeatherContext');

  const setWeatherFromCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const weatherData = await fetchWeather({ latitude, longitude, timezone });

      setWeatherData(weatherData);
    });
  }, [fetchWeather, setWeatherData]);

  return { setWeatherFromCurrentLocation };
}

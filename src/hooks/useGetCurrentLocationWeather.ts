import { useCallback, useState } from 'react';
import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from './useCustomContext';
import { useWeatherAPI } from './useWeatherAPI';

export function useGetCurrentLocationWeather() {
  const { fetchWeather } = useWeatherAPI();
  const {
    beginWeatherRequest,
    completeWeatherRequest,
    isWeatherRequestCurrent,
  } = useCustomContext<WeatherContextType>('WeatherContext');
  const [locationError, setLocationError] = useState<string | null>(null);

  const setWeatherFromCurrentLocation = useCallback((): Promise<void> => {
    const requestId = beginWeatherRequest();
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Location services are not supported by this browser.');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const weatherData = await fetchWeather({ latitude, longitude, timezone });

            if (weatherData != null) {
              completeWeatherRequest(requestId, weatherData);
            } else if (isWeatherRequestCurrent(requestId)) {
              setLocationError(
                'Located you, but the forecast could not be loaded. Please try again.'
              );
            }
          } finally {
            resolve();
          }
        },
        (error) => {
          if (!isWeatherRequestCurrent(requestId)) {
            resolve();
            return;
          }

          console.error('Geolocation error', error.message);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError(
              'Location access is disabled. Enable it in your browser site settings, then try again.'
            );
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setLocationError('Your current location could not be determined.');
          } else if (error.code === error.TIMEOUT) {
            setLocationError('Finding your location took too long. Please try again.');
          } else {
            setLocationError('Unable to access your current location.');
          }
          resolve();
        }
      );
    });
  }, [
    beginWeatherRequest,
    completeWeatherRequest,
    fetchWeather,
    isWeatherRequestCurrent,
  ]);

  const clearLocationError = useCallback(() => setLocationError(null), []);

  return { setWeatherFromCurrentLocation, locationError, clearLocationError };
}

import { useCallback } from 'react';
import { useConvertCoordsToLocation } from './useConvertCoordsToLocation';
import { useCustomContext } from './useCustomContext';
import { WeatherSchema, type WeatherData } from '../utilities/weatherSchema&Type';
import type { UnitsContextType } from '../context/unitsContext';
import type { Units } from '../components/Footer';

export type FetchParams = {
  latitude: number;
  longitude: number;
  timezone: string;
  address?: string[];
  units?: Units;
};

const query = {
  current: 'temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m',
  hourly: 'temperature_2m,precipitation_probability,relative_humidity_2m,wind_speed_10m',
  daily:
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_mean,precipitation_sum',
};

export function useWeatherAPI() {
  const { convertCoordsToLocation } = useConvertCoordsToLocation();
  const { units } = useCustomContext<UnitsContextType>('UnitsContext');

  const fetchWeather = useCallback(
    async (value: FetchParams) => {
      const { latitude, longitude, timezone, address } = value;
      const { tempUnit, speedUnit, heightUnit } = value.units || units || {};

      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        timezone,
        ...query,
        ...(tempUnit && { temperature_unit: tempUnit }),
        ...(speedUnit && { wind_speed_unit: speedUnit }),
        ...(heightUnit && { precipitation_unit: heightUnit }),
      });

      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        const json = await response.json();
        const data = WeatherSchema.parse(json);

        let addressArray: string[];
        if (address) {
          addressArray = address;
        } else {
          addressArray = await convertCoordsToLocation(data.latitude, data.longitude);
        }

        const weatherData: WeatherData = {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          address: addressArray,
          current: data.current,
          daily: data.daily,
          hourly: data.hourly,
          current_units: data.current_units,
          daily_units: data.daily_units,
          hourly_units: data.hourly_units,
        };

        return weatherData;
      } catch (err) {
        console.error('Could not fetch weather data: ', err);
        return null;
      }
    },
    [units, convertCoordsToLocation]
  );

  return { fetchWeather };
}

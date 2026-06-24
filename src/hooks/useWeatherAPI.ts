import { useConvertCoordsToLocation } from './useConvertCoordsToLocation';
import { useCustomContext } from './useCustomContext';
import { UnitsContextType } from '../context/unitsContext';
import {
  FetchWeatherParamsInterface,
  WeatherDataInterface,
  CurrentDataInterface,
  DayDataInterface,
  HourDataInterface,
} from '../utilities/interfaces';
import { useCallback } from 'react';

const query: { current: string; hourly: string; daily: string } = {
  current: 'temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m',
  hourly: 'temperature_2m,precipitation_probability,relative_humidity_2m,wind_speed_10m',
  daily:
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_mean,precipitation_sum',
};

export function useWeatherAPI() {
  const { convertCoordsToLocation } = useConvertCoordsToLocation();
  const { units } = useCustomContext<UnitsContextType>('UnitsContext');

  //function returned from hook
  const fetchWeather = useCallback(
    async (value: FetchWeatherParamsInterface): Promise<WeatherDataInterface | null> => {
      const { latitude, longitude, timezone, address } = value;
      const { tempUnit, speedUnit, heightUnit } = value.units || units || {};

      try {
        if (!latitude || !longitude)
          throw new Error('Arguments do not include valid coordinates');

        //full search params including dynamic data
        const params = new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          ...query,
          ...(timezone && { timezone }),
          ...(tempUnit && { temperature_unit: tempUnit }),
          ...(speedUnit && { wind_speed_unit: speedUnit }),
          ...(heightUnit && { precipitation_unit: heightUnit }),
        });

        //fetch data and extract properties
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        const data = await response.json();

        const { current, hourly, daily, latitude: lat, longitude: lon } = data;

        //create currentData object from the api response data
        const currentData: CurrentDataInterface = {
          precipitation: current.precipitation,
          relative_humidity_2m: current.relative_humidity_2m,
          temperature_2m: current.temperature_2m,
          wind_speed_10m: current.wind_speed_10m,
          time: new Date(current.time),
        };

        //change daily data from an object of property arrays to an array of day objects
        const dailyDataArray: DayDataInterface[] = [];
        if (daily) {
          for (let i = 0; i < 7; i++) {
            const dayData: DayDataInterface = {
              day: new Date(daily.time[i]),
              weatherCode: daily.weather_code[i],
              tempMax: daily.temperature_2m_max[i].toFixed(0),
              tempMin: daily.temperature_2m_min[i].toFixed(0),
              precProb: daily.precipitation_probability_mean[i].toFixed(0),
              precSum: daily.precipitation_sum[i].toFixed(0),
            };
            dailyDataArray.push(dayData);
          }
        }

        //change hourly data from an object of property arrays to an array of day objects
        const hourlyDataArray: HourDataInterface[] = [];
        if (hourly) {
          for (let i = 0; i < hourly.time.length; i++) {
            const hourData: HourDataInterface = {
              time: new Date(hourly.time[i]),
              temperature_2m: hourly.temperature_2m[i].toFixed(0),
              precipitation_probability: hourly.precipitation_probability[i].toFixed(0),
              relative_humidity_2m: hourly.relative_humidity_2m[i].toFixed(0),
              wind_speed_10m: hourly.wind_speed_10m[i].toFixed(0),
            };
            hourlyDataArray.push(hourData);
          }
        }
        //pull address from searchbar, otherwise fetch name from coords using reverse geolocation
        let addressArray: string[];
        if (address) {
          addressArray = address;
        } else {
          addressArray = await convertCoordsToLocation(lat, lon);
        }

        //object to be returned and eventually set to weather context state
        const weatherData: WeatherDataInterface = {
          ...data,
          current: currentData,
          hourly: hourlyDataArray,
          daily: dailyDataArray,
          address: addressArray,
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

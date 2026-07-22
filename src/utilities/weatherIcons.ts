import clearDay from '../assets/weather/clear-day.svg';
import clearNight from '../assets/weather/clear-night.svg';
import drizzle from '../assets/weather/drizzle.svg';
import extremeRain from '../assets/weather/extreme-rain.svg';
import fog from '../assets/weather/fog.svg';
import fogNight from '../assets/weather/fog-night.svg';
import humidity from '../assets/weather/humidity.svg';
import overcast from '../assets/weather/overcast.svg';
import overcastNight from '../assets/weather/overcast-night.svg';
import partlyCloudyDay from '../assets/weather/partly-cloudy-day.svg';
import partlyCloudyNight from '../assets/weather/partly-cloudy-night.svg';
import rain from '../assets/weather/rain.svg';
import raindrop from '../assets/weather/raindrop.svg';
import sleet from '../assets/weather/sleet.svg';
import snow from '../assets/weather/snow.svg';
import thunderstorms from '../assets/weather/thunderstorms.svg';
import wind from '../assets/weather/wind.svg';

export type WeatherIconType =
  | 'clear'
  | 'partlyCloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavyRain'
  | 'freezing'
  | 'snow'
  | 'storm';

const dayIcons: Record<WeatherIconType, string> = {
  clear: clearDay,
  partlyCloudy: partlyCloudyDay,
  overcast: overcast,
  fog: fog,
  drizzle: drizzle,
  rain: rain,
  heavyRain: extremeRain,
  freezing: sleet,
  snow: snow,
  storm: thunderstorms,
};

const nightIcons: Partial<Record<WeatherIconType, string>> = {
  clear: clearNight,
  partlyCloudy: partlyCloudyNight,
  overcast: overcastNight,
  fog: fogNight,
};

export const metricIcons = {
  precipitation: raindrop,
  humidity,
  wind,
  brand: partlyCloudyDay,
} as const;

export function getWeatherIconType(code: number): WeatherIconType {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partlyCloudy';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code === 56 || code === 57 || code === 66 || code === 67) return 'freezing';
  if (code === 61 || code === 63 || code === 80) return 'rain';
  if (code === 65 || code === 81 || code === 82) return 'heavyRain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'overcast';
}

export function getWeatherIconSrc(type: WeatherIconType, isDay = true): string {
  if (!isDay) {
    return nightIcons[type] ?? dayIcons[type];
  }
  return dayIcons[type];
}

export function getWeatherIconByCode(code: number, isDay = true): string {
  return getWeatherIconSrc(getWeatherIconType(code), isDay);
}

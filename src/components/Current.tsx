import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';
import { codes } from '../utilities/weatherCodes';
import { getWeatherIconType, metricIcons } from '../utilities/weatherIcons';
import WeatherIcon from './WeatherIcon';

export default function Current() {
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');

  const { current, current_units: units } = weatherData!;
  const weatherCode = current.weather_code;
  const condition = codes[weatherCode] ?? `Unknown (${weatherCode})`;
  const iconType = getWeatherIconType(weatherCode);
  const isDay = current.is_day === 1;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-600 p-3 text-white shadow-xl shadow-sky-900/20 sm:rounded-3xl sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-10 h-52 w-52 rounded-full bg-amber-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-6 h-44 w-44 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />

      <div className="relative flex items-center justify-between gap-2 sm:gap-8">
        <div className="min-w-0">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-sky-50/85 sm:text-xs sm:tracking-[0.2em]">
            Right now
          </p>
          <div className="mt-0.5 flex items-start gap-0.5 sm:mt-3 sm:gap-1">
            <p className="text-4xl font-extralight leading-none tracking-tighter sm:text-8xl">
              {Math.round(current.temperature_2m)}
            </p>
            <span className="mt-0.5 text-base font-medium text-sky-50/95 sm:mt-2 sm:text-3xl">
              {units.temperature_2m}
            </span>
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-white sm:mt-4 sm:text-xl">
            {condition}
          </p>
        </div>

        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-md sm:h-40 sm:w-40">
          <WeatherIcon
            type={iconType}
            title={condition}
            isDay={isDay}
            className="h-12 w-12 drop-shadow-lg sm:h-28 sm:w-28"
          />
        </div>
      </div>

      <div className="relative mt-3 grid grid-cols-3 gap-1 sm:mt-8 sm:gap-3">
        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-white/15 px-1 py-1.5 text-center ring-1 ring-white/25 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-left">
          <img
            src={metricIcons.precipitation}
            alt=""
            className="h-5 w-5 drop-shadow-sm sm:h-10 sm:w-10"
            aria-hidden
            draggable={false}
          />
          <div className="min-w-0">
            <span className="block text-[0.6rem] font-medium text-sky-50/80 sm:text-xs">
              <span className="sm:hidden">Rain</span>
              <span className="hidden sm:inline">Precipitation</span>
            </span>
            <p className="truncate text-[0.7rem] font-semibold sm:text-base">
              {current.precipitation}
              {units.precipitation}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-white/15 px-1 py-1.5 text-center ring-1 ring-white/25 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-left">
          <img
            src={metricIcons.humidity}
            alt=""
            className="h-5 w-5 drop-shadow-sm sm:h-10 sm:w-10"
            aria-hidden
            draggable={false}
          />
          <div className="min-w-0">
            <span className="block text-[0.6rem] font-medium text-sky-50/80 sm:text-xs">
              Humidity
            </span>
            <p className="truncate text-[0.7rem] font-semibold sm:text-base">
              {current.relative_humidity_2m}
              {units.relative_humidity_2m}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5 rounded-lg bg-white/15 px-1 py-1.5 text-center ring-1 ring-white/25 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-left">
          <img
            src={metricIcons.wind}
            alt=""
            className="h-5 w-5 drop-shadow-sm sm:h-10 sm:w-10"
            aria-hidden
            draggable={false}
          />
          <div className="min-w-0">
            <span className="block text-[0.6rem] font-medium text-sky-50/80 sm:text-xs">
              Wind
            </span>
            <p className="truncate text-[0.7rem] font-semibold sm:text-base">
              {current.wind_speed_10m}
              {units.wind_speed_10m}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

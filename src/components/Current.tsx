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
    <section className="relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-blue-700 via-sky-600 to-teal-600 p-5 text-white shadow-2xl shadow-sky-950/30 ring-1 ring-sky-700/20 sm:rounded-3xl sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-10 h-52 w-52 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-6 h-44 w-44 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.25),transparent_42%)]" />

      <div className="relative flex items-center justify-between gap-4 sm:gap-8">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-50 ring-1 ring-white/20 backdrop-blur-sm sm:tracking-[0.18em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            Current weather
          </div>
          <div className="mt-2 flex items-start gap-0.5 sm:mt-3 sm:gap-1">
            <p className="text-6xl font-light leading-none tracking-tighter drop-shadow-sm sm:text-8xl sm:font-extralight">
              {Math.round(current.temperature_2m)}
            </p>
            <span className="mt-1 text-xl font-medium text-sky-50 sm:mt-2 sm:text-3xl">
              {units.temperature_2m}
            </span>
          </div>
          <p className="mt-2 truncate text-lg font-semibold text-white drop-shadow-sm sm:mt-4 sm:text-xl">
            {condition}
          </p>
        </div>

        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-white/25 shadow-lg shadow-sky-950/15 ring-1 ring-white/40 backdrop-blur-md sm:h-40 sm:w-40">
          <WeatherIcon
            type={iconType}
            title={condition}
            isDay={isDay}
            className="h-[4.5rem] w-[4.5rem] drop-shadow-xl sm:h-28 sm:w-28"
          />
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-1.5 sm:mt-8 sm:gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/20 px-1.5 py-2.5 text-center ring-1 ring-white/30 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-left">
          <img
            src={metricIcons.precipitation}
            alt=""
            className="h-6 w-6 drop-shadow-sm sm:h-10 sm:w-10"
            aria-hidden
            draggable={false}
          />
          <div className="min-w-0">
            <span className="block text-xs font-medium text-sky-50/80">
              <span className="sm:hidden">Rain</span>
              <span className="hidden sm:inline">Precipitation</span>
            </span>
            <p className="truncate text-sm font-semibold sm:text-base">
              {current.precipitation}
              {units.precipitation}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/20 px-1.5 py-2.5 text-center ring-1 ring-white/30 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-left">
          <img
            src={metricIcons.humidity}
            alt=""
            className="h-6 w-6 drop-shadow-sm sm:h-10 sm:w-10"
            aria-hidden
            draggable={false}
          />
          <div className="min-w-0">
            <span className="block text-xs font-medium text-sky-50/80">
              Humidity
            </span>
            <p className="truncate text-sm font-semibold sm:text-base">
              {current.relative_humidity_2m}
              {units.relative_humidity_2m}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/20 px-1.5 py-2.5 text-center ring-1 ring-white/30 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-left">
          <img
            src={metricIcons.wind}
            alt=""
            className="h-6 w-6 drop-shadow-sm sm:h-10 sm:w-10"
            aria-hidden
            draggable={false}
          />
          <div className="min-w-0">
            <span className="block text-xs font-medium text-sky-50/80">
              Wind
            </span>
            <p className="truncate text-sm font-semibold sm:text-base">
              {current.wind_speed_10m}
              {units.wind_speed_10m}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

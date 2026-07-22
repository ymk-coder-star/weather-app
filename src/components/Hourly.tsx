import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from 'react';
import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';
import { codes } from '../utilities/weatherCodes';
import { getWeatherIconType } from '../utilities/weatherIcons';
import WeatherIcon from './WeatherIcon';

type HourData = {
  time: Date;
  temperature_2m: string;
  precipitation_probability: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
  weather_code: number;
  is_day: boolean;
};

export type HourlyDay = {
  date: Date | undefined;
  displayDate: string;
};

export default function Hourly({ dayToDisplay }: { dayToDisplay: HourlyDay }) {
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { hourly, hourly_units: units, current } = weatherData!;
  const hourlyListRef = useRef<HTMLOListElement>(null);

  const scrollHourly = (direction: -6 | 6) => {
    hourlyListRef.current?.scrollBy({
      left: direction * 120,
      behavior: 'smooth',
    });
  };

  const hourlyDataArray: HourData[] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const hourData: HourData = {
      time: new Date(hourly.time[i]!),
      temperature_2m: hourly.temperature_2m[i]!.toFixed(0),
      precipitation_probability: hourly.precipitation_probability[i]!.toFixed(0),
      relative_humidity_2m: hourly.relative_humidity_2m[i]!.toFixed(0),
      wind_speed_10m: hourly.wind_speed_10m[i]!.toFixed(0),
      weather_code: hourly.weather_code[i]!,
      is_day: hourly.is_day[i] === 1,
    };
    hourlyDataArray.push(hourData);
  }

  const date = dayToDisplay.date;
  let selectedDayHourlyArray: HourData[];
  if (date === undefined) {
    const currentTimeIndex = hourlyDataArray.findIndex(
      (hour) => hour.time.getHours() === new Date(current.time).getHours()
    );

    const startIndex = currentTimeIndex === -1 ? 0 : currentTimeIndex;
    const endIndex = startIndex + 25;

    selectedDayHourlyArray = hourlyDataArray.slice(startIndex, endIndex);
  } else {
    selectedDayHourlyArray = hourlyDataArray.filter(
      (hour) => hour.time.toDateString() === date.toDateString()
    );
  }

  useEffect(() => {
    const list = hourlyListRef.current;
    if (!list) return;

    const frame = window.requestAnimationFrame(() => {
      if (date === undefined) {
        list.scrollTo({ left: 0, behavior: 'auto' });
        return;
      }

      const sixAmCard = list.querySelector<HTMLElement>('[data-hour="6"]');
      if (sixAmCard) {
        list.scrollTo({
          left: sixAmCard.offsetLeft - list.offsetLeft,
          behavior: 'auto',
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [date, weatherData?.latitude, weatherData?.longitude, current.time]);

  return (
    <>
      <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5 sm:gap-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-800 sm:text-lg">
            Hourly forecast
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
            {dayToDisplay.displayDate}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => scrollHourly(-6)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-sky-200 bg-sky-50 text-xs text-sky-700 transition hover:bg-sky-100 active:scale-95 sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm"
            aria-label="View earlier hours"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            type="button"
            onClick={() => scrollHourly(6)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-sky-200 bg-sky-50 text-xs text-sky-700 transition hover:bg-sky-100 active:scale-95 sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm"
            aria-label="View later hours"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      <ol
        ref={hourlyListRef}
        className="flex snap-x gap-2 overflow-x-auto pb-1 sm:gap-3 sm:pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {selectedDayHourlyArray.map((hour, index) => {
          const isNow = date === undefined && index === 0;
          const iconType = getWeatherIconType(hour.weather_code);
          const condition = codes[hour.weather_code] ?? `Unknown (${hour.weather_code})`;

          return (
            <li
              key={hour.time.toISOString()}
              data-hour={hour.time.getHours()}
              className={`flex min-w-[5.5rem] snap-start flex-col items-center rounded-xl px-2 py-2.5 text-center transition sm:min-w-[7.25rem] sm:rounded-2xl sm:px-3 sm:py-4 ${
                isNow
                  ? 'bg-gradient-to-b from-sky-500 to-teal-600 text-white shadow-md shadow-sky-900/15'
                  : 'border border-sky-300/60 bg-gradient-to-b from-sky-50 to-cyan-100/90 text-slate-800 hover:border-sky-400 hover:from-sky-100'
              }`}
            >
              <p
                className={`text-xs font-semibold ${
                  isNow ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                {isNow
                  ? 'Now'
                  : hour.time.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
              </p>
              <WeatherIcon
                type={iconType}
                title={condition}
                isDay={hour.is_day}
                className="mt-1 h-9 w-9 sm:mt-2 sm:h-11 sm:w-11"
              />
              <p className="mt-1 text-xl font-semibold tracking-tight sm:mt-2 sm:text-2xl">
                {hour.temperature_2m}
                {units.temperature_2m}
              </p>
              <p
                className={`mt-1.5 text-xs sm:mt-3 ${
                  isNow ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                {hour.precipitation_probability}
                {units.precipitation_probability}
              </p>
              <p
                className={`mt-0.5 hidden text-xs sm:block ${
                  isNow ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                {hour.wind_speed_10m} {units.wind_speed_10m}
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
}

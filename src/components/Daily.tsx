import type { Dispatch, SetStateAction } from 'react';
import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';
import { codes } from '../utilities/weatherCodes';
import { getWeatherIconType } from '../utilities/weatherIcons';
import type { HourlyDay } from './Hourly';
import WeatherIcon from './WeatherIcon';

type DayData = {
  day: Date;
  weatherCode: number;
  tempMax: string;
  tempMin: string;
  precProb: string;
  precSum: string;
};

export default function Daily({
  setHourlyDay,
  selectedDay,
}: {
  setHourlyDay: Dispatch<SetStateAction<HourlyDay>>;
  selectedDay: HourlyDay;
}) {
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { daily, daily_units: units } = weatherData!;

  const dailyDataArray: DayData[] = [];
  for (let i = 0; i < daily.time.length; i++) {
    const dayData: DayData = {
      day: new Date(daily.time[i]!),
      weatherCode: daily.weather_code[i]!,
      tempMax: daily.temperature_2m_max[i]!.toFixed(0),
      tempMin: daily.temperature_2m_min[i]!.toFixed(0),
      precProb: daily.precipitation_probability_mean[i]!.toFixed(0),
      precSum: daily.precipitation_sum[i]!.toFixed(0),
    };
    dailyDataArray.push(dayData);
  }

  return (
    <section className="rounded-2xl border border-sky-300/50 bg-gradient-to-br from-sky-100/90 via-cyan-50/85 to-teal-100/80 p-2.5 shadow-lg shadow-sky-900/10 backdrop-blur-md sm:rounded-3xl sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-slate-800 sm:text-lg">
            7-day forecast
          </h2>
          <p className="mt-0.5 hidden text-sm text-slate-500 sm:mt-1 sm:block">
            Select a day for hourly details
          </p>
        </div>
        <p className="hidden text-xs font-medium uppercase tracking-wider text-slate-400 sm:block">
          Low / High
        </p>
      </div>

      <div className="mt-1.5 space-y-0 sm:mt-5 sm:space-y-1">
        {dailyDataArray.map((day, index) => {
          let dayOfWeek: string;
          switch (index) {
            case 0:
              dayOfWeek = 'Today';
              break;
            case 1:
              dayOfWeek = 'Tomorrow';
              break;
            default:
              dayOfWeek = day.day.toLocaleDateString(undefined, { weekday: 'short' });
          }
          const dayOfMonth = day.day.toLocaleDateString(undefined, {
            day: '2-digit',
            month: '2-digit',
          });
          const dayToDisplay = `${dayOfWeek} ${dayOfMonth}`;
          const isSelected =
            selectedDay.date === undefined
              ? index === 0
              : selectedDay.date.toDateString() === day.day.toDateString();
          const iconType = getWeatherIconType(day.weatherCode);
          const condition = codes[day.weatherCode] ?? `Unknown (${day.weatherCode})`;

          return (
            <button
              key={day.day.toISOString()}
              type="button"
              onClick={() => setHourlyDay({ date: day.day, displayDate: dayToDisplay })}
              className={`grid w-full grid-cols-[minmax(4rem,1fr)_2rem_minmax(3.75rem,auto)] items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition sm:grid-cols-[minmax(7rem,1fr)_3rem_minmax(8rem,1.5fr)_auto] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md shadow-sky-900/10'
                  : 'text-slate-800 hover:bg-sky-200/80'
              }`}
            >
              <div>
                <p className="text-[0.7rem] font-semibold sm:text-sm">{dayOfWeek}</p>
                <p
                  className={`text-[0.6rem] sm:mt-0.5 sm:text-xs ${
                    isSelected ? 'text-sky-100' : 'text-slate-500'
                  }`}
                >
                  {dayOfMonth}
                </p>
              </div>
              <WeatherIcon
                type={iconType}
                title={condition}
                className="h-7 w-7 sm:h-10 sm:w-10"
              />
              <p
                className={`hidden text-sm sm:block ${
                  isSelected ? 'text-sky-50' : 'text-slate-500'
                }`}
              >
                {condition}
              </p>
              <div className="text-right">
                <p className="text-[0.7rem] font-semibold sm:text-sm">
                  <span className={isSelected ? 'text-sky-100' : 'text-slate-400'}>
                    {day.tempMin}°
                  </span>{' '}
                  / {day.tempMax}°
                </p>
                <p
                  className={`text-[0.6rem] sm:mt-0.5 sm:text-xs ${
                    isSelected ? 'text-sky-100' : 'text-slate-500'
                  }`}
                >
                  {day.precProb}% · {day.precSum}
                  {units.precipitation_sum}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

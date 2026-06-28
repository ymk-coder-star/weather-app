import { useCustomContext } from '../hooks/useCustomContext';
import { codes } from '../utilities/weatherCodes';
import type { Dispatch, SetStateAction } from 'react';
import type { WeatherContextType } from '../context/weatherContext';
import type { HourlyDay } from './Hourly';

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
}: {
  setHourlyDay: Dispatch<SetStateAction<HourlyDay>>;
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
    <div className="daily-section">
      <h4>Next 7 days</h4>

      <div className="daily-wrapper">
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

          return (
            <div
              className="day-card"
              key={Math.random()}
              onClick={() => setHourlyDay({ date: day.day, displayDate: dayToDisplay })}
            >
              <p>{dayToDisplay}</p>
              <p>{codes[day.weatherCode]}</p>
              <p>
                min/max {day.tempMin}°/{day.tempMax}°
              </p>
              <p>
                {day.precProb}% precipitation {day.precSum} {units.precipitation_sum}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

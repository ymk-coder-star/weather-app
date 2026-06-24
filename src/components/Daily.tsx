import { Dispatch, SetStateAction } from 'react';
import { useCustomContext } from '../hooks/useCustomContext';
import { WeatherContextType } from '../context/weatherContext';
import { codes } from '../utilities/weatherCodes';
import { DateForHourlyInterface } from '../utilities/interfaces';

export default function Daily({
  setHourlyDay,
}: {
  setHourlyDay: Dispatch<SetStateAction<DateForHourlyInterface>>;
}) {
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { daily, daily_units: units } = weatherData!;

  return (
    <div className="daily-section">
      <h4>Next 7 days</h4>

      <div className="daily-wrapper">
        {daily.map((day, index) => {
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

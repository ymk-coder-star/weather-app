import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';

type HourData = {
  time: Date;
  temperature_2m: string;
  precipitation_probability: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
};

export type HourlyDay = {
  date: Date | undefined;
  displayDate: string;
};

export default function Hourly({ dayToDisplay }: { dayToDisplay: HourlyDay }) {
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { hourly, hourly_units: units, current } = weatherData!;

  const hourlyDataArray: HourData[] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const hourData: HourData = {
      time: new Date(hourly.time[i]!),
      temperature_2m: hourly.temperature_2m[i]!.toFixed(0),
      precipitation_probability: hourly.precipitation_probability[i]!.toFixed(0),
      relative_humidity_2m: hourly.relative_humidity_2m[i]!.toFixed(0),
      wind_speed_10m: hourly.wind_speed_10m[i]!.toFixed(0),
    };
    hourlyDataArray.push(hourData);
  }

  const date = dayToDisplay.date;
  let selectedDayHourlyArray: HourData[];
  if (date === undefined) {
    const currentTimeIndex = hourlyDataArray.findIndex(
      (hour) => hour.time.getHours() === new Date(current.time).getHours()
    );
    selectedDayHourlyArray = hourlyDataArray.slice(
      currentTimeIndex,
      currentTimeIndex + 25
    );
  } else {
    selectedDayHourlyArray = hourlyDataArray.filter(
      (hour) => hour.time.toDateString() === date.toDateString()
    );
  }

  return (
    <>
      <h4>Hourly forecast</h4>
      <h5>{dayToDisplay.displayDate}</h5>

      <ol className="hourly-forecast">
        {selectedDayHourlyArray.map((hour, index) => (
          <li key={hour.time.toISOString()}>
            <p>
              <span>
                {date === undefined && index === 0
                  ? 'Now'
                  : hour.time.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                {' - '}
              </span>
              <span>
                {hour.temperature_2m}
                {units.temperature_2m} {hour.precipitation_probability}
                {units.precipitation_probability}
              </span>
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}

import { useCustomContext } from '../hooks/useCustomContext';
import { WeatherContextType } from '../context/weatherContext';
import { DateForHourlyInterface, HourDataInterface } from '../utilities/interfaces';

export default function Hourly({
  dayToDisplay,
}: {
  dayToDisplay: DateForHourlyInterface;
}) {
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { hourly, hourly_units: units, current } = weatherData!;
  const date = dayToDisplay.date;

  let selectedDayHourlyArray: HourDataInterface[];
  if (date === undefined) {
    const currentTimeIndex = hourly.findIndex(
      (hour) => hour.time.getHours() === current.time.getHours()
    );
    selectedDayHourlyArray = hourly.slice(currentTimeIndex, currentTimeIndex + 25);
  } else {
    selectedDayHourlyArray = hourly.filter(
      (hour) => hour.time.getDate() === date.getDate()
    );
  }

  return (
    <>
      <h4>Hourly forecast</h4>
      <h5>{dayToDisplay.displayDate}</h5>

      <ol className="hourly-forecast">
        {selectedDayHourlyArray.map((hour, index) => (
          <li key={Math.random()}>
            <p>
              <span>
                {!date && index === 0
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

import { useCustomContext } from '../hooks/useCustomContext';
import type { WeatherContextType } from '../context/weatherContext';

export default function Current() {
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');

  const { current, current_units: units } = weatherData!;

  return (
    <div className="current-section">
      <h4>Current weather</h4>

      <div className="current-output">
        <p>
          Temperature {current.temperature_2m}
          {units.temperature_2m}
        </p>
        <p>
          Precipitation {current.precipitation} {units.precipitation}
        </p>
        <p>
          Humidity {current.relative_humidity_2m}
          {units.relative_humidity_2m}
        </p>
        <p>
          Wind speed {current.wind_speed_10m} {units.wind_speed_10m}
        </p>
      </div>
    </div>
  );
}

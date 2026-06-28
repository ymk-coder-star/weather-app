import { useReducer, type ChangeEvent, type SubmitEvent } from 'react';
import { useWeatherAPI } from '../hooks/useWeatherAPI';
import { useCustomContext } from '../hooks/useCustomContext';
import type { WeatherContextType } from '../context/weatherContext';
import type { UnitsContextType } from '../context/unitsContext';

export type Units = {
  tempUnit?: string;
  speedUnit?: string;
  heightUnit?: string;
};

export default function Footer() {
  const { fetchWeather } = useWeatherAPI();
  const { weatherData, setWeatherData } =
    useCustomContext<WeatherContextType>('WeatherContext');
  const { setUnits: setWeatherUnits } =
    useCustomContext<UnitsContextType>('UnitsContext');

  const unitsReducer = (state: Units, action: { type: string; payload: string }) => {
    switch (action.type) {
      case 'EDIT_TEMP_UNIT':
        return { ...state, tempUnit: action.payload };
      case 'EDIT_SPEED_UNIT':
        return { ...state, speedUnit: action.payload };
      case 'EDIT_HEIGHT_UNIT':
        return { ...state, heightUnit: action.payload };
      default:
        return state;
    }
  };

  const [units, dispatch] = useReducer(unitsReducer, {
    tempUnit: '',
    speedUnit: '',
    heightUnit: '',
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>, type: string) => {
    const value = e.target.value;
    dispatch({ type, payload: value });
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setWeatherUnits(units);

    if (weatherData == null) return;

    const data = await fetchWeather({ ...weatherData, units });
    setWeatherData(data);
  };

  return (
    <footer>
      <h4>Set units</h4>
      <form className="set-units" onSubmit={handleSubmit}>
        <label>
          <span>Temperature: </span>
          <select onChange={(e) => handleChange(e, 'EDIT_TEMP_UNIT')}>
            <option value={'celsius'}>Celsius</option>
            <option value={'fahrenheit'}>Fahrenheit</option>
          </select>
        </label>
        <label>
          <span>Wind speed: </span>
          <select onChange={(e) => handleChange(e, 'EDIT_SPEED_UNIT')}>
            <option value={'kmh'}>km/h</option>
            <option value={'ms'}>m/s</option>
            <option value={'mph'}>mph</option>
            <option value={'kn'}>knot</option>
          </select>
        </label>
        <label>
          <span>Precipitation: </span>
          <select onChange={(e) => handleChange(e, 'EDIT_HEIGHT_UNIT')}>
            <option value={'mm'}>mm</option>
            <option value={'inch'}>inch</option>
          </select>
        </label>
        <button>Save</button>
      </form>
    </footer>
  );
}

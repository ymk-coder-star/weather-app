import { useReducer } from 'react';
import { useWeatherAPI } from '../../hooks/useWeatherAPI';
import { useWeatherContext } from '../../hooks/useWeatherContext';

//styles
import './Footer.css';

export default function Footer() {
	const { fetchWeather } = useWeatherAPI();
	const { weatherData, setWeatherData } = useWeatherContext();

	const unitsReducer = (state, action) => {
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

	const handleChange = (e, type) => {
		const value = e.target.value;
		dispatch({ type, payload: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = await fetchWeather({ ...weatherData, units });

		setWeatherData(data);
	};

	return (
		<footer>
			<h4>Set units</h4>
			<form className="set-units" onSubmit={(e) => handleSubmit(e)}>
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

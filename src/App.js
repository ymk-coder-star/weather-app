import { useState } from 'react';

//components
import LocationSearchForm from './components/LocationSearchForm';

//styles
import './App.css';

function App() {
	const [weatherData, setWeatherData] = useState({});

	const {
		temperature_2m,
		relative_humidity_2m,
		precipitation,
		wind_speed_10m,
	} = weatherData.currentData ?? '';

	return (
		<div className="App">
			<LocationSearchForm setWeatherData={setWeatherData} />
			{
				<div className="forecast-output">
					<h3>Current weather</h3>
					<p>Temperature {temperature_2m} Celsius</p>
					<p>Humidity {relative_humidity_2m}%</p>
					<p>Precipitation {precipitation}mm</p>
					<p>Wind speed {wind_speed_10m}kmh</p>
				</div>
			}
		</div>
	);
}

export default App;

import { fetchWeatherApi } from 'openmeteo';

export function useWeatherAPI() {
	//API endpoint
	const forecastUrl = 'https://api.open-meteo.com/v1/forecast';

	//query parameters incl current, hourly, daily
	const query = {
		current: [
			'temperature_2m',
			'precipitation',
			'relative_humidity_2m',
			'wind_speed_10m',
		],
	};

	//function returned from hook
	const fetchWeather = async (location) => {
		//full search params including dynamic location data
		const params = {
			latitude: [location.latitude],
			longitude: [location.longitude],
			...query,
		};

		//fetch data and extract current weather
		const [response] = await fetchWeatherApi(forecastUrl, params);
		const current = response.current();

		//set returned data to an object and store in a variable
		const weatherData = {
			currentData: {
				temperature_2m: current.variables(0).value().toFixed(1),
				relative_humidity_2m: current.variables(1).value().toFixed(0),
				precipitation: current.variables(2).value().toFixed(0),
				wind_speed_10m: current.variables(3).value().toFixed(0),
			},
		};

		return weatherData;
	};
	return { fetchWeather };
}

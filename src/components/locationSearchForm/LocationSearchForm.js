import Select from 'react-select';
import { useState } from 'react';
import { useWeatherAPI } from '../../hooks/useWeatherAPI';
import { useWeatherContext } from '../../hooks/useWeatherContext';

//styles
import './LocationSearchForm.css';

export default function LocationSearchForm() {
	const [results, setResults] = useState([]);
	const { fetchWeather } = useWeatherAPI();
	const { setWeatherData } = useWeatherContext();

	const handleInputChange = (input) => {
		fetchLocations(input);
		return input;
	};

	const fetchLocations = async (input) => {
		if (!input) return;

		const geoLocateUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`;

		const res = await fetch(geoLocateUrl);
		const data = await res.json();

		setResults(data.results);
	};

	const handleChange = async (value) => {
		const weatherData = await fetchWeather(value);
		setWeatherData(weatherData);
	};

	const selectOptions =
		results &&
		results.map((result) => {
			const addressArray = [result.name, result.admin2, result.admin1, result.country];
			const cleanArry = addressArray.filter((item, index) => {
				return item && addressArray.indexOf(item) === index;
			});

			return {
				value: {
					latitude: result.latitude,
					longitude: result.longitude,
					timezone: result.timezone,
					address: cleanArry,
				},
				label: cleanArry.join(', '),
				key: result.id,
			};
		});

	return (
		<Select
			options={selectOptions}
			onInputChange={(e) => handleInputChange(e)}
			onChange={(option) => {
				option && handleChange(option.value);
			}}
			placeholder="Enter location"
			isSearchable
			isClearable
			autoFocus
			classNamePrefix="select"
		/>
	);
}

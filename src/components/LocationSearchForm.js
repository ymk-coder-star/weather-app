import { useState } from 'react';
import Select from 'react-select';
import { useWeatherAPI } from '../hooks/useWeatherAPI';

export default function LocationSearchForm({ setWeatherData }) {
	//init states and import functions
	const [results, setResults] = useState([]);
	const { fetchWeather } = useWeatherAPI();

	const handleChange = (input) => {
		fetchLocation(input);
		return input;
	};

	const fetchLocation = async (query) => {
		if (!query) return;

		const geoLocateUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;
		const res = await fetch(geoLocateUrl);
		const data = await res.json();

		setResults(data.results);
	};

	const handleSubmit = async (location) => {
		if (location) {
			const data = await fetchWeather(location.value);
			setWeatherData(data);
		}
	};

	const selectOptions =
		results &&
		results.map((result) => ({
			value: {
				latitude: result.latitude,
				longitude: result.longitude,
			},
			label: `${result.name}, ${result.admin1}, ${result.country}`,
			key: result.id,
		}));

	return (
		<Select
			options={selectOptions}
			onInputChange={(e) => handleChange(e)}
			onChange={(option) => handleSubmit(option)}
			placeholder="Enter location"
			isClearable
			isSearchable
			autoFocus
			styles={{
				display: 'flex',
				input: (base) => ({
					...base,
					textAlign: 'center',
				}),
				control: (base) => ({
					...base,
					justifyContent: 'center',
				}),
				valueContainer: (base) => ({
					...base,
					justifyContent: 'center',
				}),
			}}
		/>
	);
}

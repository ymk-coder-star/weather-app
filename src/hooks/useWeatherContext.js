import { useContext } from 'react';
import { WeatherContext } from '../context/weatherContext';

export function useWeatherContext() {
	const context = useContext(WeatherContext);

	if (!context) {
		throw new Error('weatherContext must be used inside a WeatherContextProvider');
	}

	return context;
}

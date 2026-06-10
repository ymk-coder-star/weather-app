import { createContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherContextProvider = ({ children }) => {
	const [weatherData, setWeatherData] = useState({ data: 'Initial state' });

	return (
		<WeatherContext.Provider value={{ weatherData, setWeatherData }}>
			{children}
		</WeatherContext.Provider>
	);
};

import { useWeatherAPI } from '../hooks/useWeatherAPI';
import { useWeatherContext } from './useWeatherContext';

export function useGetCurrLocWeather() {
	const { fetchWeather } = useWeatherAPI();
	const { setWeatherData } = useWeatherContext();

	const setWeatherFromCurrLoc = async () => {
		await navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;

			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			const weatherData = await fetchWeather({ latitude, longitude, timezone });

			setWeatherData(weatherData);
		});
	};

	return { setWeatherFromCurrLoc };
}

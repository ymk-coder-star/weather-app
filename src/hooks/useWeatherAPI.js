import { useConvertCoordsToLocation } from './useReverseGeolocate';

export function useWeatherAPI() {
	const { convertCoordsToLocation } = useConvertCoordsToLocation();

	const query = {
		current: 'temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m',
		hourly:
			'temperature_2m,precipitation_probability,relative_humidity_2m,wind_speed_10m',
		daily: [
			'weather_code',
			'temperature_2m_max',
			'temperature_2m_min',
			'precipitation_probability_mean',
			'precipitation_sum',
		],
	};

	//function returned from hook
	const fetchWeather = async (value) => {
		const { latitude, longitude, timezone, address } = value;
		const { tempUnit, speedUnit, heightUnit } = value.units || {};

		if (!latitude || !longitude) return;

		//full search params including dynamic data
		const params = new URLSearchParams({
			latitude,
			longitude,
			...query,
			...(timezone && { timezone }),
			...(tempUnit && { temperature_unit: tempUnit }),
			...(speedUnit && { wind_speed_unit: speedUnit }),
			...(heightUnit && { precipitation_unit: heightUnit }),
		});

		//fetch data and extract properties
		try {
			const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
			const data = await response.json();

			const { current, hourly, daily, latitude: lat, longitude: lon } = data;

			//change daily data from an object of property arrays to an array of day objects
			const dailyDataArray = [];
			if (daily) {
				for (let i = 0; i < 7; i++) {
					const dayData = {
						day: new Date(daily.time[i]).toLocaleDateString('en-US', {
							weekday: 'short',
						}),
						weatherCode: daily.weather_code[i],
						tempMax: daily.temperature_2m_max[i].toFixed(0),
						tempMin: daily.temperature_2m_min[i].toFixed(0),
						precProb: daily.precipitation_probability_mean[i],
						precSum: daily.precipitation_sum[i].toFixed(0),
					};
					dailyDataArray.push(dayData);
				}
			}

			//change hourly data from an object of property arrays to an array of day objects
			const hourlyDataArray = [];
			if (hourly && current) {
				const currentHour = new Date(current.time).getHours();
				for (let i = currentHour + 1; i < currentHour + 25; i++) {
					const hourData = {
						time: new Date(hourly.time[i]).getHours().toString().padStart(2, '0'),
						temperature_2m: hourly.temperature_2m[i].toFixed(0),
						precipitation_probability: hourly.precipitation_probability[i].toFixed(0),
						relative_humidity_2m: hourly.relative_humidity_2m[i].toFixed(0),
						wind_speed_10m: hourly.wind_speed_10m[i].toFixed(0),
					};
					hourlyDataArray.push(hourData);
				}
			}

			//pull address from searchbar, otherwise fetch name from coords using reverse geolocation
			const addressArray =
				address || (await convertCoordsToLocation(lat, lon)?.addressArr);

			//object to be returned and eventually set to weather context state
			const weatherData = {
				...data,
				hourly: hourlyDataArray,
				daily: dailyDataArray,
				address: addressArray,
			};

			return weatherData;
		} catch (err) {
			console.error(err);
		}
	};

	return { fetchWeather };
}

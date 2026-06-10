import { useWeatherContext } from '../../../hooks/useWeatherContext';

export default function Hourly() {
	const { weatherData } = useWeatherContext();

	const { hourly, hourly_units: units } = weatherData || {};

	return (
		<>
			<h4>Hourly forecast</h4>

			<ol className="hourly-forecast">
				{hourly &&
					hourly.length > 0 &&
					hourly.map((hour, index) => (
						<li key={index}>
							<p>
								{hour.time}:00 {hour.temperature_2m}
								{units.temperature_2m} {hour.precipitation_probability}
								{units.precipitation_probability}
							</p>
						</li>
					))}
			</ol>
		</>
	);
}

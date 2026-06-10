import { useWeatherContext } from '../../../hooks/useWeatherContext';
import { WeatherCodes } from '../../../objects/WeatherCodes';

export default function Daily() {
	const { weatherData } = useWeatherContext();
	const { codes } = WeatherCodes();

	const { daily, daily_units: units } = weatherData || {};

	const displayDay = (day, index) => {
		switch (index) {
			case 0:
				return 'Today';
			case 1:
				return 'Tomorrow';
			default:
				return day.day;
		}
	};

	return (
		<div className="daily-section">
			<h4>Next 7 days</h4>

			{daily && daily.length > 0 && (
				<div className="daily-wrapper">
					{daily.map((day, index) => (
						<div className="day-card" key={day.day}>
							<p>{displayDay(day, index)}</p>
							<p>{codes[day.weatherCode]}</p>
							<p>
								min/max {day.tempMin}°/{day.tempMax}°
							</p>
							<p>
								{day.precProb}% precipitation {day.precSum} {units.precipitation_sum}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { useGetCurrLocWeather } from '../hooks/useGetCurrLocWeather';

export default function CurLocationBtn() {
	const { setWeatherFromCurrLoc } = useGetCurrLocWeather();

	const handleClick = () => {
		setWeatherFromCurrLoc();
	};

	return (
		<button onClick={handleClick} title="Current location">
			<FontAwesomeIcon icon={faLocationCrosshairs} />
		</button>
	);
}

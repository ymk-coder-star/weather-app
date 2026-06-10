import { useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { useGetCurrLocWeather } from '../../hooks/useGetCurrLocWeather';
import { useWeatherContext } from '../../hooks/useWeatherContext';
import { useUserContext } from '../../hooks/useUserContext';

//components
import Current from './children/Current';
import Hourly from './children/Hourly';
import Daily from './children/Daily';

export default function ForecastOutput({ isFavourite }) {
	const { addDocument, deleteDocument } = useFirestore('favourites');
	const { setWeatherFromCurrLoc } = useGetCurrLocWeather();
	const { weatherData } = useWeatherContext();
	const { user } = useUserContext();

	const { latitude, longitude, address } = weatherData;

	useEffect(() => {
		setWeatherFromCurrLoc();
	}, []);

	const handleAdd = () => {
		if (!user.uid) return;

		const doc = {
			...{ latitude },
			...{ longitude },
			...{ address: address || ['(unnamed)'] },
			uid: user.uid,
		};
		const docId = `${user.uid}&${latitude}:${longitude}`;

		addDocument(doc, docId);
	};

	const handleRemove = () => {
		if (!user.uid) return;

		const docId = `${user.uid}&${latitude}:${longitude}`;

		deleteDocument(docId);
	};

	return (
		<div>
			<div className="heading">
				{weatherData.current && <h3>{address ? address.join(', ') : '(unnamed)'}</h3>}
				{weatherData.current && !isFavourite && <button onClick={handleAdd}>Add</button>}
				{isFavourite && <button onClick={handleRemove}>Remove</button>}
			</div>

			<div className="forecast-output">
				<div className="left-side">
					<Hourly />
				</div>
				<div className="right-side">
					<Current />
					<Daily />
				</div>
			</div>
		</div>
	);
}

import { useState, useEffect } from 'react';
import { useCollection } from '../hooks/useCollection';
import { useWeatherAPI } from '../hooks/useWeatherAPI';
import { useWeatherContext } from '../hooks/useWeatherContext';

export default function Sidebar({ setIsFavourite }) {
	//extracting from the imported hooks
	const { documents } = useCollection('favourites');
	const { fetchWeather } = useWeatherAPI();
	const { weatherData, setWeatherData } = useWeatherContext();
	const [favourites, setFavourites] = useState([]);

	//check for 'favourites' firestore collection and get weather forecast on items
	useEffect(() => {
		if (documents.length === 0) {
			setFavourites(documents);
			return;
		}

		const fetchDocs = async () => {
			try {
				const favouritesArr = await Promise.all(
					documents.map(async (item) => {
						const rcvdData = await fetchWeather({
							latitude: item.latitude,
							longitude: item.longitude,
						});
						const readyData = {
							...rcvdData,
							address: item.address,
							id: item.id,
						};
						return readyData;
					})
				);
				setFavourites(favouritesArr);
			} catch (err) {
				console.error(err);
			}
		};
		fetchDocs();
	}, [documents]);

	//check if current weatherData state is a favourite
	useEffect(() => {
		setIsFavourite(false);
		for (const fav of favourites) {
			if (
				fav.latitude === weatherData.latitude &&
				fav.longitude === weatherData.longitude
			) {
				setIsFavourite(true);
				return;
			}
		}
	}, [weatherData, favourites, setIsFavourite]);

	const handleClick = (item) => {
		setWeatherData(item);
	};

	return (
		<div className="sidebar">
			<h3>Saved places</h3>
			{favourites.length > 0 &&
				favourites.map((item) => (
					<div className="place-card" key={item.id} onClick={() => handleClick(item)}>
						<p>{item.address[0]}</p>
						<p>
							{item.current?.temperature_2m?.toFixed(0)}
							{item.current_units.temperature_2m}
						</p>
					</div>
				))}
		</div>
	);
}

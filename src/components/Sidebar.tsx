import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useWeatherAPI } from '../hooks/useWeatherAPI';
import { useCollection } from '../hooks/useCollection';
import { useCustomContext } from '../hooks/useCustomContext';
import { WeatherContextType } from '../context/weatherContext';
import { UnitsContextType } from '../context/unitsContext';
import { FavouriteDocInterface, WeatherDataInterface } from '../utilities/interfaces';

type Props = {
  setIsFavourite: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({ setIsFavourite }: Props) {
  //extracting from the imported hooks and setting state
  const { fetchWeather } = useWeatherAPI();
  const { documents } = useCollection<FavouriteDocInterface>('favourites');
  const { weatherData, setWeatherData } =
    useCustomContext<WeatherContextType>('WeatherContext');
  const { units } = useCustomContext<UnitsContextType>('UnitsContext');
  const [favourites, setFavourites] = useState<
    (WeatherDataInterface | FavouriteDocInterface)[]
  >([]);

  //check for 'favourites' firestore collection and get weather forecast on items
  useEffect(() => {
    if (documents.length === 0) {
      setFavourites([]);
      return;
    }

    (async () => {
      try {
        const favouritesArray = await Promise.all(
          documents.map(async (document) => {
            const fetchWeatherParams = {
              latitude: document.latitude,
              longitude: document.longitude,
              timezone: document.timezone,
              address: document.address,
            };

            const receivedData = await fetchWeather(fetchWeatherParams);

            if (receivedData) {
              return { ...receivedData, id: document.id };
            } else {
              return document;
            }
          })
        );

        setFavourites(favouritesArray);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [documents, units, fetchWeather]);

  //check if current weatherData state is a favourite
  useEffect(() => {
    setIsFavourite(false);

    if (weatherData) {
      for (const favourite of favourites) {
        if (
          favourite.latitude === weatherData.latitude &&
          favourite.longitude === weatherData.longitude
        ) {
          setIsFavourite(true);
          return;
        }
      }
    }
  }, [weatherData, favourites, setIsFavourite]);

  const handleClick = (location: WeatherDataInterface) => {
    setWeatherData(location);
  };

  return (
    <div className="sidebar">
      <h3>Saved places</h3>

      {favourites.map((favourite) => {
        if ('current' in favourite)
          return (
            <div
              className="place-card"
              key={favourite.id}
              onClick={() => handleClick(favourite)}
            >
              <p>{favourite.address[0]}</p>
              <p>
                {favourite.current.temperature_2m.toFixed(0)}
                {favourite.current_units.temperature_2m}
              </p>
            </div>
          );
        else
          return (
            <div className="place-card disabled" key={favourite.id}>
              <p>{favourite.address[0]}</p>
            </div>
          );
      })}
    </div>
  );
}

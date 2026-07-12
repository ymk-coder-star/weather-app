import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { UnitsContextType } from '../context/unitsContext';
import type { WeatherContextType } from '../context/weatherContext';
import { useCollection } from '../hooks/useCollection';
import { useCustomContext } from '../hooks/useCustomContext';
import { useWeatherAPI } from '../hooks/useWeatherAPI';
import type { WeatherData } from '../utilities/weatherSchema&Type';
import type { Document } from './ForecastOutput';

type Props = {
  setIsFavourite: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({ setIsFavourite }: Props) {
  //extracting from the imported hooks and setting state
  const { fetchWeather } = useWeatherAPI();
  const { documents } = useCollection<Document>('favourites');
  const { units } = useCustomContext<UnitsContextType>('UnitsContext');
  const { weatherData, setWeatherData } =
    useCustomContext<WeatherContextType>('WeatherContext');
  const [favourites, setFavourites] = useState<(WeatherData | Document)[]>([]);

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
              return { ...receivedData };
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
          break;
        }
      }
    }
  }, [weatherData, favourites, setIsFavourite]);

  const handleClick = (location: WeatherData) => {
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
              key={favourite.latitude.toString() + favourite.longitude.toString()}
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
            <div className="place-card disabled" key={Math.random()}>
              <p>{favourite.address[0]}</p>
            </div>
          );
      })}
    </div>
  );
}

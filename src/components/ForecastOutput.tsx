import { useEffect, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useGetCurrentLocationWeather } from '../hooks/useGetCurrentLocationWeather';
import { useCustomContext } from '../hooks/useCustomContext';
import { WeatherContextType } from '../context/weatherContext';
import { UserContextType } from '../context/userContext';
import {
  AddFavouriteDocInterface,
  DateForHourlyInterface,
} from '../utilities/interfaces';

//components
import Current from './Current';
import Hourly from './Hourly';
import Daily from './Daily';

export default function ForecastOutput({ isFavourite }: { isFavourite: boolean }) {
  const { setWeatherFromCurrentLocation } = useGetCurrentLocationWeather();
  const { addDocument, deleteDocument } =
    useFirestore<AddFavouriteDocInterface>('favourites');
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { user } = useCustomContext<UserContextType>('UserContext');
  const [selectedDay, setSelectedDay] = useState<DateForHourlyInterface>({
    date: undefined,
    displayDate: 'Today',
  });

  useEffect(() => {
    setWeatherFromCurrentLocation();
  }, [setWeatherFromCurrentLocation]);

  useEffect(() => {
    setSelectedDay({ date: undefined, displayDate: 'Today' });
  }, [weatherData?.hourly]);

  const handleAdd = () => {
    if (!user.uid) return;
    if (!weatherData) return;

    const doc: AddFavouriteDocInterface = {
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      timezone: weatherData.timezone,
      address: weatherData.address,
      uid: user.uid,
    };
    const docId = `${user.uid}&${weatherData.latitude}:${weatherData.longitude}`;

    addDocument(doc, docId);
  };

  const handleRemove = () => {
    if (!user.uid) return;
    if (!weatherData) return;

    const docId = `${user.uid}&${weatherData.latitude}:${weatherData.longitude}`;

    deleteDocument(docId);
  };

  return (
    <div>
      {weatherData === undefined && (
        <h4>Search for a place or enable location in browser settings</h4>
      )}
      {weatherData === null && <h4>Could not fetch weather forecast</h4>}
      {weatherData && (
        <>
          <div className="heading">
            {<h3>{weatherData.address.join(', ')}</h3>}
            {!isFavourite && <button onClick={handleAdd}>Add</button>}
            {isFavourite && <button onClick={handleRemove}>Remove</button>}
          </div>

          <div className="forecast-output">
            <div className="left-side">
              <Hourly dayToDisplay={selectedDay} />
            </div>
            <div className="right-side">
              <Current />
              <Daily setHourlyDay={setSelectedDay} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import type { UserContextType } from '../context/userContext';
import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';
import { useFirestore } from '../hooks/useFirestore';
import type { HourlyDay } from './Hourly';

//components
import Current from './Current';
import Daily from './Daily';
import Hourly from './Hourly';

export type Document = {
  latitude: number;
  longitude: number;
  timezone: string;
  address: string[];
  uid: string;
};

const hourlyDefaultHeading = { date: undefined, displayDate: 'Today' };

export default function ForecastOutput({ isFavourite }: { isFavourite: boolean }) {
  const [selectedDay, setSelectedDay] = useState<HourlyDay>(hourlyDefaultHeading);
  const { addDocument, deleteDocument } = useFirestore<Document>('favourites');
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { user } = useCustomContext<UserContextType>('UserContext');

  useEffect(() => {
    setSelectedDay(hourlyDefaultHeading);
  }, [weatherData]);

  const handleAdd = () => {
    if (user.uid == null) return;
    if (weatherData == null) return;

    const doc: Document = {
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
    if (user.uid == null) return;
    if (weatherData == null) return;

    const docId = `${user.uid}&${weatherData.latitude}:${weatherData.longitude}`;

    deleteDocument(docId);
  };

  if (weatherData === undefined)
    return (
      <div>
        <h4>Search for a place or enable location in browser settings</h4>
      </div>
    );

  if (weatherData === null)
    return (
      <div>
        <h4>Unable to load data</h4>
      </div>
    );

  return (
    <div>
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
    </div>
  );
}

import {
  faLocationDot,
  faMagnifyingGlass,
  faStar,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import type { UserContextType } from '../context/userContext';
import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';
import { useFirestore } from '../hooks/useFirestore';
import type { HourlyDay } from './Hourly';

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

type Props = {
  isFavourite: boolean;
  onFavouriteChange: (isFavourite: boolean) => void;
};

export default function ForecastOutput({ isFavourite, onFavouriteChange }: Props) {
  const [selectedDay, setSelectedDay] = useState<HourlyDay>(hourlyDefaultHeading);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { addDocument, deleteDocument } = useFirestore<Document>('favourites');
  const { weatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const { user } = useCustomContext<UserContextType>('UserContext');
  const isSignedIn = user.uid != null;

  useEffect(() => {
    setSelectedDay(hourlyDefaultHeading);
    setSaveError(null);
  }, [weatherData]);

  useEffect(() => {
    if (!saveError) return;
    const timeout = window.setTimeout(() => setSaveError(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [saveError]);

  const handleAdd = async () => {
    if (!isSignedIn) {
      setSaveError('Still signing in — try again in a moment.');
      return;
    }
    if (weatherData == null) return;

    setIsSaving(true);
    setSaveError(null);

    const doc: Document = {
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      timezone: weatherData.timezone,
      address: weatherData.address,
      uid: user.uid,
    };
    const docId = `${user.uid}&${weatherData.latitude}:${weatherData.longitude}`;

    onFavouriteChange(true);
    const ok = await addDocument(doc, docId);
    setIsSaving(false);
    if (!ok) {
      onFavouriteChange(false);
      setSaveError('Could not save this place. Please try again.');
    }
  };

  const handleRemove = async () => {
    if (!isSignedIn) {
      setSaveError('Still signing in — try again in a moment.');
      return;
    }
    if (weatherData == null) return;

    setIsSaving(true);
    setSaveError(null);

    const docId = `${user.uid}&${weatherData.latitude}:${weatherData.longitude}`;
    onFavouriteChange(false);
    const ok = await deleteDocument(docId);
    setIsSaving(false);
    if (!ok) {
      onFavouriteChange(true);
      setSaveError('Could not remove this place. Please try again.');
    }
  };

  if (weatherData === undefined)
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-sky-200/60 bg-gradient-to-br from-white/70 to-sky-100/80 px-6 py-16 text-center shadow-lg shadow-sky-900/5 backdrop-blur-md">
        <div className="max-w-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sky-500/15 text-2xl text-sky-600 ring-1 ring-sky-300/40">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Find your forecast
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Search for a city above or use your current location to see live conditions.
          </p>
        </div>
      </div>
    );

  if (weatherData === null)
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-rose-200/60 bg-gradient-to-br from-white/70 to-rose-50/80 px-6 py-16 text-center shadow-lg shadow-rose-900/5 backdrop-blur-md">
        <div className="max-w-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/15 text-2xl text-rose-500 ring-1 ring-rose-200/50">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Weather unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Try another place or check your connection.
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 sm:gap-5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="hidden items-center gap-2 text-sm font-medium text-sky-800/70 sm:flex">
            <FontAwesomeIcon icon={faLocationDot} className="text-sky-600" />
            Current forecast
          </p>
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-800 sm:mt-1 sm:text-3xl">
            {weatherData.address.join(', ')}
          </h1>
        </div>
        {!isFavourite ? (
          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={!isSignedIn || isSaving}
            title={
              !isSignedIn
                ? 'Signing in…'
                : isSaving
                  ? 'Saving this place…'
                  : 'Save this place'
            }
            className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-sky-900/10 transition hover:from-sky-600 hover:to-teal-600 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          >
            {isSaving ? (
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden
              />
            ) : (
              <FontAwesomeIcon icon={faStar} />
            )}
            Save
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleRemove()}
            disabled={!isSignedIn || isSaving}
            title={isSaving ? 'Removing this place…' : 'Remove saved place'}
            className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-800 shadow-sm transition hover:bg-sky-100 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          >
            {isSaving ? (
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-300 border-t-sky-700"
                aria-hidden
              />
            ) : (
              <FontAwesomeIcon icon={faStar} />
            )}
            Saved
          </button>
        )}
      </div>

      {saveError && (
        <p className="rounded-lg border border-amber-200/60 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {saveError}
        </p>
      )}

      <div className="flex min-w-0 flex-col gap-3 sm:gap-5">
        <Current />
        <div className="min-w-0 rounded-2xl border border-sky-300/50 bg-gradient-to-br from-sky-100/90 via-cyan-50/85 to-teal-100/80 p-3 shadow-lg shadow-sky-900/10 backdrop-blur-md sm:rounded-3xl sm:p-6">
          <Hourly dayToDisplay={selectedDay} />
        </div>
        <Daily setHourlyDay={setSelectedDay} selectedDay={selectedDay} />
      </div>
    </div>
  );
}

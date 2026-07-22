import { faArrowRight, faBookmark, faLocationDot, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { UnitsContextType } from '../context/unitsContext';
import type { WeatherContextType } from '../context/weatherContext';
import { useCollection } from '../hooks/useCollection';
import { useCustomContext } from '../hooks/useCustomContext';
import { useWeatherAPI } from '../hooks/useWeatherAPI';
import { codes } from '../utilities/weatherCodes';
import { getWeatherIconType } from '../utilities/weatherIcons';
import type { WeatherData } from '../utilities/weatherSchema&Type';
import type { Document } from './ForecastOutput';
import WeatherIcon from './WeatherIcon';

type Props = {
  setIsFavourite: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  onLocationSelect?: () => void;
};

export default function Sidebar({ setIsFavourite, onClose, onLocationSelect }: Props) {
  const { fetchWeather } = useWeatherAPI();
  const { documents } = useCollection<Document>('favourites');
  const { units } = useCustomContext<UnitsContextType>('UnitsContext');
  const { weatherData, setWeatherData } =
    useCustomContext<WeatherContextType>('WeatherContext');
  const [favourites, setFavourites] = useState<(WeatherData | Document)[]>([]);

  useEffect(() => {
    if (documents.length === 0) {
      setFavourites([]);
      return;
    }

    let isCancelled = false;

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

        if (isCancelled) return;
        setFavourites(favouritesArray);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [documents, units, fetchWeather]);

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
    onLocationSelect?.();
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-sky-300/50 bg-gradient-to-br from-sky-100/90 via-cyan-50/90 to-teal-100/85 p-3 text-slate-800 shadow-lg shadow-sky-900/10 backdrop-blur-md sm:rounded-3xl sm:p-5 lg:h-auto">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sky-700/70 sm:text-xs sm:tracking-[0.18em]">
            Your list
          </p>
          <h2 className="text-base font-bold tracking-tight sm:mt-1 sm:text-lg">Saved places</h2>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500/15 text-sky-600 sm:h-10 sm:w-10">
            <FontAwesomeIcon icon={faBookmark} />
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl border border-sky-200 bg-white/70 text-slate-600 transition hover:bg-sky-100 hover:text-slate-800 sm:h-10 sm:w-10 lg:hidden"
              aria-label="Close saved places"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
      </div>

      {favourites.length === 0 && (
        <div className="mt-3 rounded-2xl border border-dashed border-sky-300 bg-sky-50/70 px-3 py-4 text-center sm:mt-5 sm:px-4 sm:py-6">
          <p className="text-sm font-medium">No saved places yet</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Save a forecast for quick access.
          </p>
        </div>
      )}

      <div className="mt-2 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto sm:mt-3 sm:gap-2">
        {favourites.map((favourite) => {
          if ('current' in favourite) {
            const weatherCode = favourite.current.weather_code;
            const condition = codes[weatherCode] ?? `Unknown (${weatherCode})`;
            const iconType = getWeatherIconType(weatherCode);
            const isDay = favourite.current.is_day === 1;

            return (
              <button
                className="group flex w-full items-center gap-2 rounded-xl border border-sky-200/70 bg-white/60 px-2.5 py-2 text-left transition hover:border-sky-400 hover:bg-sky-100 sm:gap-3 sm:rounded-2xl sm:px-3.5 sm:py-3"
                type="button"
                key={favourite.latitude.toString() + favourite.longitude.toString()}
                onClick={() => handleClick(favourite)}
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-500/10 sm:h-11 sm:w-11 sm:rounded-xl">
                  <WeatherIcon
                    type={iconType}
                    title={condition}
                    isDay={isDay}
                    className="h-7 w-7 sm:h-9 sm:w-9"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold sm:text-sm">
                    {favourite.address[0]}
                  </p>
                  <p className="truncate text-[0.65rem] text-slate-500 sm:mt-0.5 sm:text-xs">
                    {condition}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-sky-800 sm:text-lg">
                    {favourite.current.temperature_2m.toFixed(0)}
                    {favourite.current_units.temperature_2m}
                  </p>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-[0.65rem] text-sky-600 transition group-hover:translate-x-0.5 sm:text-xs"
                  />
                </div>
              </button>
            );
          }

          return (
            <button
              className="flex w-full cursor-default items-center gap-2 rounded-xl border border-sky-200/70 bg-white/60 px-2.5 py-2 text-left opacity-50 sm:gap-3 sm:rounded-2xl sm:px-3.5 sm:py-3"
              type="button"
              key={favourite.latitude.toString() + favourite.longitude.toString()}
              disabled
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-500/15 text-sm text-sky-600 sm:h-11 sm:w-11 sm:rounded-xl">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <p className="text-xs font-semibold sm:text-sm">{favourite.address[0]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

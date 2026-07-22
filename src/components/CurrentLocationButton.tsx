import {
  faLocationCrosshairs,
  faLocationDot,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGetCurrentLocationWeather } from '../hooks/useGetCurrentLocationWeather';

export default function CurrentLocationButton() {
  const { setWeatherFromCurrentLocation, locationError, clearLocationError } =
    useGetCurrentLocationWeather();
  const hasRun = useRef(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;
    setIsLocating(true);
    void setWeatherFromCurrentLocation().finally(() => setIsLocating(false));
  }, [setWeatherFromCurrentLocation]);

  useEffect(() => {
    if (!locationError) return;

    const dismissTimeout = window.setTimeout(clearLocationError, 5000);

    return () => window.clearTimeout(dismissTimeout);
  }, [locationError, clearLocationError]);

  const handleClick = async () => {
    setIsLocating(true);
    try {
      await setWeatherFromCurrentLocation();
    } finally {
      setIsLocating(false);
    }
  };

  const errorToast =
    locationError &&
    createPortal(
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-20 sm:justify-end sm:p-0 sm:pb-0"
        role="presentation"
      >
        <div
          className="pointer-events-auto relative flex w-full max-w-md items-start gap-3 overflow-hidden rounded-2xl border border-amber-200/25 bg-slate-800/95 p-3.5 pr-3 text-left text-slate-200 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:max-w-sm sm:p-4"
          role="alert"
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-200/10 text-amber-200/80">
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold leading-snug">Location access unavailable</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">{locationError}</p>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
            onClick={clearLocationError}
            aria-label="Dismiss location message"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-950/40">
            <div className="h-full origin-left animate-location-countdown bg-amber-200/60" />
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <button
        className="group relative flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-teal-500 px-2.5 text-white shadow-sm transition hover:bg-teal-400 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 sm:h-12 sm:gap-2.5 sm:rounded-2xl sm:px-4"
        onClick={handleClick}
        title="Find current location"
        type="button"
        aria-label="Find current location"
        aria-busy={isLocating}
        disabled={isLocating}
      >
        <span
          className={`grid h-6 w-6 place-items-center rounded-md bg-white/15 transition group-hover:bg-white/20 sm:h-7 sm:w-7 sm:rounded-lg ${
            isLocating ? 'animate-pulse' : ''
          }`}
        >
          <FontAwesomeIcon
            icon={faLocationCrosshairs}
            className={isLocating ? 'animate-spin' : 'transition group-hover:rotate-12'}
          />
        </span>
        <span className="hidden whitespace-nowrap text-xs font-semibold sm:inline">
          {isLocating ? 'Locating…' : 'My location'}
        </span>
      </button>

      {errorToast}
    </>
  );
}

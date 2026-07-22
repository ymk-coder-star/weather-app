import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signInAnonymously } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { UnitsContextProvider } from './context/unitsContext';
import type { UserContextType } from './context/userContext';
import { WeatherContextProvider } from './context/weatherContext';
import { projectAuth } from './firestore/config';
import { useCustomContext } from './hooks/useCustomContext';
import { metricIcons } from './utilities/weatherIcons';

import CurrentLocationButton from './components/CurrentLocationButton';
import Footer from './components/Footer';
import ForecastOutput from './components/ForecastOutput';
import LocationSearchForm from './components/LocationSearchForm';
import Sidebar from './components/Sidebar';

function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 1024px)').matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLarge(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isLarge;
}

export default function App() {
  const { setUser } = useCustomContext<UserContextType>('UserContext');
  const [isFavourite, setIsFavourite] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const isLargeScreen = useIsLargeScreen();

  useEffect(() => {
    (async () => {
      try {
        const res = await signInAnonymously(projectAuth);
        if (!res.user) throw new Error('Did not receive any response');
        setUser(res.user);
      } catch (err) {
        console.error('Could not sign in: ', err);
      }
    })();
  }, [setUser]);

  useEffect(() => {
    if (isLargeScreen) setIsSavedOpen(false);
  }, [isLargeScreen]);

  useEffect(() => {
    if (!isSavedOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSavedOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isSavedOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-sky-300 via-cyan-200 to-teal-300 font-sans text-slate-800 antialiased">
      <WeatherContextProvider>
        <UnitsContextProvider>
          <header className="sticky top-0 z-40 border-b border-white/20 bg-slate-900/90 text-white shadow-lg backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 p-1 shadow-md shadow-teal-900/20 sm:h-11 sm:w-11 sm:rounded-2xl sm:p-1.5">
                    <img
                      src={metricIcons.brand}
                      alt=""
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      aria-hidden
                      draggable={false}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold tracking-tight sm:text-2xl">Aeris</p>
                    <p className="hidden text-xs font-medium text-sky-200/80 sm:block">
                      Weather at a glance
                    </p>
                  </div>
                </div>

                {!isLargeScreen && (
                  <button
                    type="button"
                    onClick={() => setIsSavedOpen(true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-2.5 text-xs font-semibold text-white transition hover:bg-white/15 sm:h-11 sm:gap-2 sm:rounded-2xl sm:px-3 sm:text-sm"
                    aria-label="Open saved places"
                  >
                    <FontAwesomeIcon icon={faBookmark} />
                    <span>Saved Places</span>
                  </button>
                )}
              </div>

              <div className="flex w-full items-center gap-1.5 sm:gap-2 lg:w-[48rem]">
                <div className="min-w-0 flex-1">
                  <LocationSearchForm />
                </div>
                <CurrentLocationButton />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-2.5 sm:px-6 sm:py-5 lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6 lg:px-8 lg:py-7">
            <section className="min-w-0">
              <ForecastOutput
                isFavourite={isFavourite}
                onFavouriteChange={setIsFavourite}
              />
            </section>

            {isLargeScreen && (
              <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                <Sidebar setIsFavourite={setIsFavourite} />
              </aside>
            )}
          </main>

          {!isLargeScreen && (
            <div
              className={`fixed inset-0 z-50 ${
                isSavedOpen ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              aria-hidden={!isSavedOpen}
            >
              <button
                type="button"
                className={`absolute inset-0 bg-slate-950/45 transition-opacity duration-300 ${
                  isSavedOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setIsSavedOpen(false)}
                aria-label="Close saved places overlay"
                tabIndex={isSavedOpen ? 0 : -1}
              />
              <aside
                className={`absolute inset-y-0 right-0 flex w-full max-w-md transform p-3 transition-transform duration-300 ease-out sm:p-4 ${
                  isSavedOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Saved places"
              >
                <div className="min-h-0 w-full overflow-hidden">
                  <Sidebar
                    setIsFavourite={setIsFavourite}
                    onClose={() => setIsSavedOpen(false)}
                    onLocationSelect={() => setIsSavedOpen(false)}
                  />
                </div>
              </aside>
            </div>
          )}

          <Footer />
        </UnitsContextProvider>
      </WeatherContextProvider>
    </div>
  );
}

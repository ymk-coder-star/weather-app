import { signInAnonymously } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { UnitsContextProvider } from './context/unitsContext';
import type { UserContextType } from './context/userContext';
import { WeatherContextProvider } from './context/weatherContext';
import { projectAuth } from './firestore/config';
import { useCustomContext } from './hooks/useCustomContext';

//components
import CurrentLocationButton from './components/CurrentLocationButton';
import Footer from './components/Footer';
import ForecastOutput from './components/ForecastOutput';
import LocationSearchForm from './components/LocationSearchForm';
import Sidebar from './components/Sidebar';

//styles
import './App.css';

export default function App() {
  const { setUser } = useCustomContext<UserContextType>('UserContext');
  const [isFavourite, setIsFavourite] = useState<boolean>(false);

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

  return (
    <div className="App">
      <WeatherContextProvider>
        <UnitsContextProvider>
          <main className="content">
            <section className="main-left">
              <header className="location-form">
                <CurrentLocationButton />
                <LocationSearchForm />
              </header>
              <ForecastOutput isFavourite={isFavourite} />
            </section>
            <Sidebar setIsFavourite={setIsFavourite} />
          </main>
          <Footer />
        </UnitsContextProvider>
      </WeatherContextProvider>
    </div>
  );
}

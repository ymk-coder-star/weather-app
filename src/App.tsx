import { useEffect, useState } from 'react';
import { projectAuth } from './firestore/config';
import { signInAnonymously } from 'firebase/auth';
import { useCustomContext } from './hooks/useCustomContext';
import { UserContextType } from './context/userContext';
import { WeatherContextProvider } from './context/weatherContext';
import { UnitsContextProvider } from './context/unitsContext';

//components
import CurrentLocationButton from './components/CurrentLocationButton';
import LocationSearchForm from './components/LocationSearchForm';
import ForecastOutput from './components/ForecastOutput';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

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

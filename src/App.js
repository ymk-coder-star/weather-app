import { useEffect, useState } from 'react';
import { projectAuth } from './firestore/config';
import { signInAnonymously } from 'firebase/auth';
import { useUserContext } from './hooks/useUserContext';
import { WeatherContextProvider } from './context/weatherContext';

//components
import CurLocationBtn from './components/CurLocationBtn';
import LocationSearchForm from './components/locationSearchForm/LocationSearchForm';
import ForecastOutput from './components/forecastOutput/ForecastOutput';
import Sidebar from './components/Sidebar';
import Footer from './components/footer/Footer';

//styles
import './App.css';

export default function App() {
	const { setUser } = useUserContext();
	const [isFavourite, setIsFavourite] = useState(false);

	useEffect(() => {
		const signinAnon = async () => {
			try {
				const res = await signInAnonymously(projectAuth);
				setUser(res.user);
			} catch (err) {
				console.error('Could not sign in: ', err);
			}
		};
		signinAnon();
	}, [setUser]);

	return (
		<div className="App">
			<WeatherContextProvider>
				<main className="content">
					<section className="main-left">
						<header className="location-form">
							<CurLocationBtn />
							<LocationSearchForm />
						</header>
						<ForecastOutput isFavourite={isFavourite} />
					</section>
					<Sidebar setIsFavourite={setIsFavourite} />
				</main>
				<Footer />
			</WeatherContextProvider>
		</div>
	);
}

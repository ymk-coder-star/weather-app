import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { useGetCurrentLocationWeather } from '../hooks/useGetCurrentLocationWeather';

export default function CurrentLocationButton() {
  const { setWeatherFromCurrentLocation } = useGetCurrentLocationWeather();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    setWeatherFromCurrentLocation();

    hasRun.current = true;
  }, [setWeatherFromCurrentLocation]);

  const handleClick = () => {
    setWeatherFromCurrentLocation();
  };

  return (
    <button onClick={handleClick} title="Find current location">
      <FontAwesomeIcon icon={faLocationCrosshairs} />
    </button>
  );
}

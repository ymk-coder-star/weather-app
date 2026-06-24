import Select from 'react-select';
import { useState } from 'react';
import { useWeatherAPI } from '../hooks/useWeatherAPI';
import { useCustomContext } from '../hooks/useCustomContext';
import { WeatherContextType } from '../context/weatherContext';
import { FetchWeatherParamsInterface } from '../utilities/interfaces';

type AddressResult = {
  name: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  country?: string;
  timezone: string;
  latitude: number;
  longitude: number;
};

export default function LocationSearchForm() {
  const [results, setResults] = useState<AddressResult[]>([]);
  const { fetchWeather } = useWeatherAPI();
  const { setWeatherData } = useCustomContext<WeatherContextType>('WeatherContext');

  const handleInputChange = (input: string) => {
    fetchLocations(input);
    return input;
  };

  const fetchLocations = async (input: string) => {
    if (!input) return;

    try {
      const geoLocateUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`;

      const res = await fetch(geoLocateUrl);
      const data = await res.json();

      if (!data.results) return;

      setResults(data.results);
    } catch (err) {
      console.error('Could not fetch locations from search', err);
    }
  };

  const handleSelect = async (params: FetchWeatherParamsInterface) => {
    const weatherData = await fetchWeather(params);
    setWeatherData(weatherData);
  };

  const selectOptions = results.map((result) => {
    const addressArray: (string | undefined)[] = [
      result.name,
      result.admin2,
      result.admin1,
      result.country,
    ];

    const set = new Set(addressArray);
    const cleanArray: string[] = Array.from(set).filter((item): item is string =>
      Boolean(item)
    );

    return {
      value: {
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone,
        address: cleanArray,
      },
      label: cleanArray.join(', '),
    };
  });

  return (
    <Select
      options={selectOptions}
      onInputChange={handleInputChange}
      onChange={(option) => {
        option && handleSelect(option.value);
      }}
      placeholder="Start typing to search places"
      isSearchable
      isClearable
      autoFocus
      classNamePrefix="select"
    />
  );
}

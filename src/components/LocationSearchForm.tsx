import { z } from 'zod';
import Select from 'react-select';
import { useState } from 'react';
import { useWeatherAPI } from '../hooks/useWeatherAPI';
import { useCustomContext } from '../hooks/useCustomContext';
import type { WeatherContextType } from '../context/weatherContext';
import type { FetchParams } from '../hooks/useWeatherAPI';

const AddressSchema = z.object({
  results: z
    .array(
      z.object({
        name: z.string(),
        admin1: z.string().optional(),
        admin2: z.string().optional(),
        admin3: z.string().optional(),
        country: z.string().optional(),
        timezone: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .optional(),
});

type AddressResult = NonNullable<z.infer<typeof AddressSchema>['results']>;

export default function LocationSearchForm() {
  const [results, setResults] = useState<AddressResult>([]);
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
      const json = await res.json();
      const data = AddressSchema.parse(json);

      const results = data.results;

      if (results == null) return;

      setResults(results);
    } catch (err) {
      console.error('Could not fetch locations from search', err);
    }
  };

  const handleSelect = async (params: FetchParams) => {
    const weatherData = await fetchWeather(params);
    setWeatherData(weatherData);
  };

  const selectOptions = results.map((result) => {
    const addressArray = [result.name, result.admin2, result.admin1, result.country];

    const set = new Set(addressArray);
    const cleanArray: string[] = Array.from(set).filter(
      (item): item is string => item !== undefined
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
      placeholder="Search for places"
      isSearchable
      isClearable
      autoFocus
      classNamePrefix="select"
    />
  );
}

import { useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { z } from 'zod';
import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';
import type { FetchParams } from '../hooks/useWeatherAPI';
import { useWeatherAPI } from '../hooks/useWeatherAPI';

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

type AddressResults = NonNullable<z.infer<typeof AddressSchema>['results']>;

type LocationOption = {
  value: FetchParams;
  label: string;
};

function createOptions(results: AddressResults): LocationOption[] {
  return results.map((result) => {
    const addressArray = [result.name, result.admin2, result.admin1, result.country];
    const cleanArray = Array.from(new Set(addressArray)).filter(
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
}

function SearchLoadingIndicator() {
  return (
    <div
      className="mr-1 flex items-center gap-2 rounded-lg bg-slate-400/15 px-2 py-1"
      aria-label="Searching for locations"
    >
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400/40 border-t-slate-700" />
      <span className="hidden text-[0.7rem] font-semibold text-slate-600 sm:inline">
        Loading
      </span>
    </div>
  );
}

export default function LocationSearchForm() {
  const { fetchWeather } = useWeatherAPI();
  const { setWeatherData } = useCustomContext<WeatherContextType>('WeatherContext');
  const latestRequest = useRef(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LocationOption | null>(null);

  const fetchLocationOptions = async (input: string): Promise<LocationOption[]> => {
    const searchTerm = input.trim();
    if (!searchTerm) return [];

    try {
      const params = new URLSearchParams({
        name: searchTerm,
        count: '10',
        language: 'en',
        format: 'json',
      });
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

      if (!res.ok) {
        throw new Error(`Location search failed with status ${res.status}`);
      }

      const json = await res.json();
      const data = AddressSchema.parse(json);

      return createOptions(data.results ?? []);
    } catch (err) {
      console.error('Could not fetch locations from search', err);
      return [];
    }
  };

  const loadOptions = async (input: string): Promise<LocationOption[]> => {
    const request = ++latestRequest.current;
    setIsSearching(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (request !== latestRequest.current) return [];

      return await fetchLocationOptions(input);
    } finally {
      if (request === latestRequest.current) setIsSearching(false);
    }
  };

  const handleSelect = async (params: FetchParams) => {
    setIsLoadingWeather(true);
    try {
      const weatherData = await fetchWeather(params);
      if (weatherData != null) setWeatherData(weatherData);
    } finally {
      setIsLoadingWeather(false);
      setSelectedOption(null);
    }
  };

  const isLoading = isSearching || isLoadingWeather;

  return (
    <div className="relative h-10 sm:h-12">
      <AsyncSelect<LocationOption>
        unstyled
        loadOptions={loadOptions}
        value={selectedOption}
        onChange={(option) => {
          setSelectedOption(option);
          if (option) void handleSelect(option.value);
        }}
        components={{ LoadingIndicator: SearchLoadingIndicator }}
        isLoading={isLoading}
        cacheOptions
        defaultOptions={false}
        placeholder={isLoadingWeather ? 'Loading forecast…' : 'Search for a city'}
        isSearchable
        isClearable
        autoFocus
        aria-label="Search for a location"
        classNames={{
          container: () => 'h-10 sm:h-12',
          control: ({ isFocused }) =>
            `flex h-10 min-h-10 items-center rounded-xl border bg-sky-50/95 px-2.5 text-sm text-slate-800 shadow-sm transition sm:h-12 sm:min-h-12 sm:rounded-2xl sm:px-3 sm:text-base ${
              isFocused ? 'border-sky-400 ring-4 ring-inset ring-sky-400/20' : 'border-sky-200'
            } ${isLoading ? 'ring-2 ring-inset ring-sky-400/25' : ''}`,
          placeholder: () => 'text-slate-400',
          input: () => 'text-slate-900',
          singleValue: () => 'truncate text-slate-900',
          valueContainer: () => 'gap-1',
          indicatorsContainer: () => 'gap-1 text-slate-400',
          clearIndicator: () =>
            'cursor-pointer rounded-lg p-1 hover:bg-sky-100 hover:text-slate-700',
          dropdownIndicator: () =>
            'cursor-pointer rounded-lg p-1 hover:bg-sky-100 hover:text-slate-700',
          menu: () =>
            'z-50 mt-2 overflow-hidden rounded-2xl border border-sky-200 bg-sky-50 p-1.5 shadow-xl',
          option: ({ isFocused, isSelected }) =>
            `cursor-pointer rounded-xl px-3 py-2 text-sm font-medium sm:py-2.5 ${
              isSelected
                ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white'
                : isFocused
                  ? 'bg-sky-200 text-sky-900'
                  : 'text-slate-700'
            }`,
          noOptionsMessage: () => 'px-3 py-3 text-sm text-slate-500',
          loadingMessage: () => 'px-3 py-3 text-sm text-slate-500',
        }}
      />
      {isLoading && (
        <div className="pointer-events-none absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-full bg-sky-200">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-teal-500/70" />
        </div>
      )}
    </div>
  );
}

import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useReducer, type SubmitEvent } from 'react';
import Select from 'react-select';
import type { UnitsContextType } from '../context/unitsContext';
import type { WeatherContextType } from '../context/weatherContext';
import { useCustomContext } from '../hooks/useCustomContext';
import { useWeatherAPI } from '../hooks/useWeatherAPI';

export type Units = {
  tempUnit?: string;
  speedUnit?: string;
  heightUnit?: string;
};

type UnitOption = {
  value: string;
  label: string;
};

const tempOptions: UnitOption[] = [
  { value: 'celsius', label: 'Celsius' },
  { value: 'fahrenheit', label: 'Fahrenheit' },
];

const speedOptions: UnitOption[] = [
  { value: 'kmh', label: 'km/h' },
  { value: 'ms', label: 'm/s' },
  { value: 'mph', label: 'mph' },
  { value: 'kn', label: 'knot' },
];

const heightOptions: UnitOption[] = [
  { value: 'mm', label: 'mm' },
  { value: 'inch', label: 'inch' },
];

const unitSelectClassNames = {
  control: ({ isFocused }: { isFocused: boolean }) =>
    `flex min-h-10 items-center rounded-md border bg-slate-100/95 px-3 text-slate-800 shadow-none transition ${
      isFocused ? 'border-teal-500/50 ring-2 ring-teal-400/20' : 'border-slate-500/40'
    }`,
  valueContainer: () => 'gap-1 py-0',
  singleValue: () => 'text-sm font-medium text-slate-800',
  input: () => 'text-sm text-slate-800',
  indicatorsContainer: () => 'text-slate-500',
  dropdownIndicator: () =>
    'cursor-pointer rounded-md p-0.5 hover:bg-slate-200/80 hover:text-slate-700',
  indicatorSeparator: () => 'hidden',
  menu: () =>
    'z-50 mb-1 overflow-hidden rounded-lg border border-slate-300/80 bg-slate-100 p-1 shadow-lg shadow-slate-950/15',
  menuList: () => 'space-y-0.5',
  option: ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) =>
    `cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition ${
      isSelected
        ? 'bg-teal-600/90 text-white'
        : isFocused
          ? 'bg-slate-200 text-slate-800'
          : 'text-slate-700'
    }`,
};

function UnitSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: UnitOption[];
  value: UnitOption;
  onChange: (option: UnitOption) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-left text-xs font-medium text-slate-300">
      <span>{label}</span>
      <Select<UnitOption>
        unstyled
        options={options}
        value={value}
        onChange={(option) => {
          if (option) onChange(option);
        }}
        isSearchable={false}
        menuPlacement="top"
        classNames={unitSelectClassNames}
        aria-label={label}
      />
    </label>
  );
}

export default function Footer() {
  const { fetchWeather } = useWeatherAPI();
  const { weatherData, beginWeatherRequest, completeWeatherRequest } =
    useCustomContext<WeatherContextType>('WeatherContext');
  const { setUnits: setWeatherUnits } =
    useCustomContext<UnitsContextType>('UnitsContext');

  const unitsReducer = (state: Units, action: { type: string; payload: string }) => {
    switch (action.type) {
      case 'EDIT_TEMP_UNIT':
        return { ...state, tempUnit: action.payload };
      case 'EDIT_SPEED_UNIT':
        return { ...state, speedUnit: action.payload };
      case 'EDIT_HEIGHT_UNIT':
        return { ...state, heightUnit: action.payload };
      default:
        return state;
    }
  };

  const [units, dispatch] = useReducer(unitsReducer, {
    tempUnit: 'celsius',
    speedUnit: 'kmh',
    heightUnit: 'mm',
  });

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setWeatherUnits(units);

    if (weatherData == null) return;

    const requestId = beginWeatherRequest();
    const data = await fetchWeather({ ...weatherData, units });
    if (data != null) completeWeatherRequest(requestId, data);
  };

  const selectedTemp =
    tempOptions.find((option) => option.value === units.tempUnit) ?? tempOptions[0]!;
  const selectedSpeed =
    speedOptions.find((option) => option.value === units.speedUnit) ?? speedOptions[0]!;
  const selectedHeight =
    heightOptions.find((option) => option.value === units.heightUnit) ?? heightOptions[0]!;

  return (
    <footer className="mt-auto border-t border-slate-600/40 bg-slate-800/95 text-slate-100">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={faSliders} className="text-sm text-teal-400/80" />
          <h2 className="text-sm font-medium text-slate-200">Display settings</h2>
        </div>
        <form
          className="mt-2 grid grid-cols-2 items-end gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
          onSubmit={handleSubmit}
        >
          <UnitSelect
            label="Temperature"
            options={tempOptions}
            value={selectedTemp}
            onChange={(option) =>
              dispatch({ type: 'EDIT_TEMP_UNIT', payload: option.value })
            }
          />
          <UnitSelect
            label="Wind speed"
            options={speedOptions}
            value={selectedSpeed}
            onChange={(option) =>
              dispatch({ type: 'EDIT_SPEED_UNIT', payload: option.value })
            }
          />
          <UnitSelect
            label="Precipitation"
            options={heightOptions}
            value={selectedHeight}
            onChange={(option) =>
              dispatch({ type: 'EDIT_HEIGHT_UNIT', payload: option.value })
            }
          />
          <button
            type="submit"
            className="col-span-2 h-10 rounded-md bg-teal-600/90 px-4 text-sm font-semibold text-white transition hover:bg-teal-500 active:scale-[0.98] sm:col-span-1 lg:col-span-1"
          >
            Apply
          </button>
        </form>
      </div>
    </footer>
  );
}

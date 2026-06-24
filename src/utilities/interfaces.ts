export interface WeatherDataInterface {
  latitude: number;
  longitude: number;
  timezone: string;
  address: string[];
  current: CurrentDataInterface;
  hourly: HourDataInterface[];
  daily: DayDataInterface[];
  current_units: {
    precipitation: string;
    relative_humidity_2m: string;
    temperature_2m: string;
    wind_speed_10m: string;
  };
  hourly_units: {
    temperature_2m: string;
    precipitation_probability: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
  };
  daily_units: {
    precipitation_probability_mean: string;
    precipitation_sum: string;
    precipitation_2m_max: string;
    precipitation_2m_min: string;
  };
  id: string;
}

export interface CurrentDataInterface {
  time: Date;
  precipitation: string;
  relative_humidity_2m: string;
  temperature_2m: number;
  wind_speed_10m: string;
}

export interface DayDataInterface {
  day: Date;
  weatherCode: number;
  tempMax: string;
  tempMin: string;
  precProb: string;
  precSum: string;
}

export interface HourDataInterface {
  time: Date;
  temperature_2m: string;
  precipitation_probability: string;
  relative_humidity_2m: string;
  wind_speed_10m: string;
}

export interface UnitsInterface {
  tempUnit?: string;
  speedUnit?: string;
  heightUnit?: string;
}

export interface FetchWeatherParamsInterface {
  latitude: number;
  longitude: number;
  timezone: string;
  address?: string[];
  units?: UnitsInterface;
}

export interface AddFavouriteDocInterface {
  latitude: number;
  longitude: number;
  timezone: string;
  address: string[];
  uid: string;
}
export interface FavouriteDocInterface extends AddFavouriteDocInterface {
  id: string;
}

export interface DateForHourlyInterface {
  date: Date | undefined;
  displayDate: string;
}

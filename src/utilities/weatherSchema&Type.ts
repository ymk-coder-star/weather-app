import { z } from 'zod';

const DailySchema = z
  .object({
    time: z.array(z.string()),
    precipitation_probability_mean: z.array(z.number()),
    precipitation_sum: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    weather_code: z.array(z.number()),
  })
  .refine((daily) => {
    const lengths = Object.values(daily).map((arr) => arr.length);
    return lengths.every((length) => length === lengths[0]);
  });

const HourlySchema = z
  .object({
    time: z.array(z.string()),
    precipitation_probability: z.array(z.number()),
    relative_humidity_2m: z.array(z.number()),
    temperature_2m: z.array(z.number()),
    wind_speed_10m: z.array(z.number()),
    weather_code: z.array(z.number()),
    is_day: z.array(z.number()),
  })
  .refine((hourly) => {
    const lengths = Object.values(hourly).map((arr) => arr.length);
    return lengths.every((length) => length === lengths[0]);
  });

export const WeatherSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  current: z.object({
    time: z.string(),
    precipitation: z.number(),
    relative_humidity_2m: z.number(),
    temperature_2m: z.number(),
    wind_speed_10m: z.number(),
    is_day: z.number(),
    weather_code: z.number(),
  }),
  daily: DailySchema,
  hourly: HourlySchema,
  current_units: z.object({
    precipitation: z.string(),
    relative_humidity_2m: z.string(),
    temperature_2m: z.string(),
    wind_speed_10m: z.string(),
  }),
  daily_units: z.object({
    precipitation_probability_mean: z.string(),
    precipitation_sum: z.string(),
    temperature_2m_max: z.string(),
    temperature_2m_min: z.string(),
  }),
  hourly_units: z.object({
    precipitation_probability: z.string(),
    relative_humidity_2m: z.string(),
    temperature_2m: z.string(),
    wind_speed_10m: z.string(),
  }),
});

type WeatherResponseType = z.infer<typeof WeatherSchema>;

export type WeatherData = WeatherResponseType & {
  address: string[];
};

import { useCallback } from 'react';
import { z } from 'zod';

const AddressSchema = z.object({
  address: z.object({
    village: z.string().optional(),
    town: z.string().optional(),
    city: z.string().optional(),
    county: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }),
});

export const useConvertCoordsToLocation = () => {
  const convertCoordsToLocation = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      if (!res.ok) {
        throw new Error(`Reverse geocoding request failed with status: ${res.status}`);
      }

      const json = await res.json();

      if (json.error) throw new Error(json.error);

      const data = AddressSchema.parse(json);

      const addressArr: string[] = [
        data.address.village,
        data.address.town,
        data.address.city,
        data.address.county,
        data.address.state,
        data.address.country,
      ].filter((item): item is string => Boolean(item));

      return addressArr;
    } catch (error) {
      console.error('Could not get address: ', error);
      return ['(unnamed)'];
    }
  }, []);

  return { convertCoordsToLocation };
};

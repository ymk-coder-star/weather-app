import { useCallback } from 'react';

export const useConvertCoordsToLocation = () => {
  const convertCoordsToLocation = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();

      const location = data.address;

      if (location === undefined) throw new Error(`Could not get address: ${data.error}`);

      const addressArr: string[] = [
        location.village,
        location.town,
        location.city,
        location.county,
        location.state,
        location.country,
      ].filter(Boolean);

      return addressArr;
    } catch (err) {
      console.error(err);
      return ['unnamed'];
    }
  }, []);

  return { convertCoordsToLocation };
};

export const useConvertCoordsToLocation = () => {
	const convertCoordsToLocation = async (lat, lon) => {
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
			);
			const data = await res.json();

			const loc = data.address;

			const addressArr =
				loc &&
				[loc.village, loc.town, loc.city, loc.county, loc.state, loc.country].filter(
					Boolean
				);

			return { addressObj: loc, addressArr };
		} catch (err) {
			console.error(err);
			return null;
		}
	};

	return { convertCoordsToLocation };
};

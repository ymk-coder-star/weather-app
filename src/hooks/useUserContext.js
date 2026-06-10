import { useContext } from 'react';
import { UserContext } from '../context/userContext';

export function useUserContext() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('UserContext must be used inside a UserContextProvider');
	}

	return context;
}

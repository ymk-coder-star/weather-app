import { useEffect, useState } from 'react';
import { projectFirestore } from '../firestore/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useUserContext } from './useUserContext';

export function useCollection(collectionName) {
	const [documents, setDocuments] = useState([]);
	const { user } = useUserContext();

	useEffect(() => {
		if (!user.uid) return;

		const docQuery = query(
			collection(projectFirestore, collectionName),
			where('uid', '==', user.uid)
		);

		onSnapshot(docQuery, (snapshot) => {
			const documents = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			setDocuments(documents);
		});
	}, [user]);

	return { documents };
}

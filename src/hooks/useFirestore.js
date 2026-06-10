import { projectFirestore } from '../firestore/config';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export function useFirestore(collectionName) {
	const colRef = [projectFirestore, collectionName];

	const addDocument = async (document, customId) => {
		try {
			await setDoc(doc(...colRef, customId), document);
		} catch (err) {
			console.error(err);
		}
	};

	const deleteDocument = async (id) => {
		try {
			await deleteDoc(doc(...colRef, id));
		} catch (err) {
			console.error(err);
		}
	};

	return { addDocument, deleteDocument };
}

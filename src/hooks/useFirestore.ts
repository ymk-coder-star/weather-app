import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  type DocumentData,
} from 'firebase/firestore';
import { projectFirestore } from '../firestore/config';

export function useFirestore<T extends DocumentData>(collectionName: string) {
  const colRef = collection(projectFirestore, collectionName);

  const addDocument = async (document: T, customId: string) => {
    try {
      await setDoc(doc(colRef, customId), document);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(colRef, id));
    } catch (err) {
      console.error(err);
    }
  };

  return { addDocument, deleteDocument };
}

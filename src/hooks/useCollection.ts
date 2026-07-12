import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { UserContextType } from '../context/userContext';
import { projectFirestore } from '../firestore/config';
import { useCustomContext } from './useCustomContext';

export function useCollection<T>(collectionName: string) {
  const [documents, setDocuments] = useState<T[]>([]);
  const { user } = useCustomContext<UserContextType>('UserContext');

  useEffect(() => {
    if (!user.uid) return;

    const docQuery = query(
      collection(projectFirestore, collectionName),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(docQuery, (snapshot) => {
      try {
        const documents: T[] = snapshot.docs.map((doc) => ({ ...doc.data() }) as T);
        setDocuments(documents);
      } catch (error) {
        console.error('Error parsing firestore snapshot: ', error);
      }
    });

    return unsubscribe;
  }, [user, collectionName]);

  return { documents };
}

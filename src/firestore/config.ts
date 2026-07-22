import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function requireEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env in the project root, then restart the dev server (npm start).`
    );
  }
  return value;
}

const firebaseConfig = {
  apiKey: requireEnv('REACT_APP_API_KEY'),
  authDomain: requireEnv('REACT_APP_AUTH_DOMAIN'),
  projectId: requireEnv('REACT_APP_PROJECT_ID'),
  storageBucket: requireEnv('REACT_APP_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('REACT_APP_MESSAGING_SENDER_ID'),
  appId: requireEnv('REACT_APP_APP_ID'),
};

const app = initializeApp(firebaseConfig);

export const projectAuth = getAuth(app);
export const projectFirestore = getFirestore(app);

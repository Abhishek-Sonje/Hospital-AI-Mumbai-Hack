import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBSNYZISx7rRdCD85GI14umh5t_OiVVhWk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mumbai-hacks-197c7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mumbai-hacks-197c7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mumbai-hacks-197c7.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "904366453458",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:904366453458:web:8875366adfe211546bf30b",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-1L16VQP8ED"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const realtimeDb: Database = getDatabase(app);

// Initialize Firestore and enable persistence BEFORE any operations
const firestoreInstance = getFirestore(app);

// Enable persistence only in browser environment and before any Firestore operations
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(firestoreInstance).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not available in this browser');
    } else {
      console.warn('Firestore persistence error:', err);
    }
  });
}

export const db: Firestore = firestoreInstance;

export default app;

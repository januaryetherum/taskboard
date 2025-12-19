import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBHDlAYZBaMSMbDhSd8wDINgTElPvNbtLs",
  authDomain: "taskboard-994da.firebaseapp.com",
  projectId: "taskboard-994da",
  storageBucket: "taskboard-994da.firebasestorage.app",
  messagingSenderId: "367621445384",
  appId: "1:367621445384:web:c6cd39bc6ab23aea91febd",
  measurementId: "G-7PBZ97LN0Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCk3O8k0TQXVwl0ZOzFr8Tyz5LF8eTbyKY",
    authDomain: "elmajid-bfd61.firebaseapp.com",
    projectId: "elmajid-bfd61",
    storageBucket: "elmajid-bfd61.firebasestorage.app",
    messagingSenderId: "49473227827",
    appId: "1:49473227827:web:1edf02cd45524a99726746",
    measurementId: "G-97KR2EJZWF"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

export default app;

import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyAtYgrVSHWTTP9Nadx_id_dzEKGf5q9eLY",
  authDomain: "new-hub-2bf76.firebaseapp.com",
  projectId: "new-hub-2bf76",
  storageBucket: "new-hub-2bf76.firebasestorage.app",
  messagingSenderId: "645310345158",
  appId: "1:645310345158:web:98248f1074c2e5450b4cc7",
  measurementId: "G-K9FX8STXL7"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore and enable offline persistence for better reliability
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, offline persistence can only be enabled in one tab at a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support offline persistence.');
  }
});

export default app;
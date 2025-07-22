
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "civic-anomaly-detector",
  appId: "1:100114684048:web:ac4e4757a7a11176c42015",
  storageBucket: "civic-anomaly-detector.firebasestorage.app",
  apiKey: "AIzaSyDtD0fjOxNBg3iRQPr2GyEG47CIwXkSGqg",
  authDomain: "civic-anomaly-detector.firebaseapp.com",
  messagingSenderId: "100114684048"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };

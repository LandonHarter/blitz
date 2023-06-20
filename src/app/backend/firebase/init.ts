import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

import dotenv from "dotenv";
dotenv.config();

/*
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};*/

const firebaseConfig:FirebaseOptions = {
  apiKey: "AIzaSyB1QnUJVyf0hm3YOKSVo_R3iv300LydjMc",
  authDomain: "blitz-c4a7c.firebaseapp.com",
  projectId: "blitz-c4a7c",
  storageBucket: "blitz-c4a7c.appspot.com",
  messagingSenderId: "811288720110",
  appId: "1:811288720110:web:69d6f1399218d73c31b9ff",
  measurementId: "G-QDE84XR9TL",
  databaseURL: "https://blitz-c4a7c-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();
export const realtimeDb = getDatabase();
export const storage = getStorage();
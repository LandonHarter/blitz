import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Analytics, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1QnUJVyf0hm3YOKSVo_R3iv300LydjMc",
  authDomain: "blitz-c4a7c.firebaseapp.com",
  projectId: "blitz-c4a7c",
  storageBucket: "blitz-c4a7c.appspot.com",
  messagingSenderId: "811288720110",
  appId: "1:811288720110:web:69d6f1399218d73c31b9ff",
  measurementId: "G-QDE84XR9TL"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();

let firebaseAnalytics:Analytics;
export const analytics = () => {
  if (!firebaseAnalytics) {
    getAnalytics(app);
  }

  return firebaseAnalytics;
};
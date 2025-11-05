// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // 👈 añade esto

const firebaseConfig = {
  apiKey: "AIzaSyCnJipByLsJhgxTSovV_ruhl7L9G53ZCgQ",
  authDomain: "soporte360-49958.firebaseapp.com",
  projectId: "soporte360-49958",
  storageBucket: "soporte360-49958.appspot.com",
  messagingSenderId: "737714479810",
  appId: "1:737714479810:web:66e756f9c75ecdd230115b",
  measurementId: "G-1Z27JT93KF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 añade esta línea

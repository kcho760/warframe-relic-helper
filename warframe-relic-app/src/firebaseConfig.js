// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnYs2vgpTmlLv6_-Tmx34L6noyPKRolk4",
  authDomain: "warframe-relic-app.firebaseapp.com",
  projectId: "warframe-relic-app",
  storageBucket: "warframe-relic-app.appspot.com",
  messagingSenderId: "1001745080939",
  appId: "1:1001745080939:web:6d2082381f295cce1b072e",
  measurementId: "G-HJ7D2YGV71"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

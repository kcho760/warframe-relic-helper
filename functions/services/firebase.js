// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnYs2vgpTmlLv6_-Tmx34L6noyPKRolk4",
  authDomain: "warframe-relic-app.firebaseapp.com",
  projectId: "warframe-relic-app",
  storageBucket: "warframe-relic-app.appspot.com",
  messagingSenderId: "1001745080939",
  appId: "1:1001745080939:web:6d2082381f295cce1b072e",
  measurementId: "G-HJ7D2YGV71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
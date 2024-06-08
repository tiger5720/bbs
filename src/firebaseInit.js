// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGzfK57TJuTBrgtccdS4fgQBtpfuSrdMI",
  authDomain: "inha-c21a1.firebaseapp.com",
  projectId: "inha-c21a1",
  storageBucket: "inha-c21a1.appspot.com",
  messagingSenderId: "809021535296",
  appId: "1:809021535296:web:bdd99449dd98fb26e2dba5",
  measurementId: "G-P22G0HRK52"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
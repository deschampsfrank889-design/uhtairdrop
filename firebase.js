// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMo5Gsb56z5Y6xoGrwDbleCvL8H_JSuJs",
  authDomain: "storeroom-f968d.firebaseapp.com",
  projectId: "storeroom-f968d",
  storageBucket: "storeroom-f968d.firebasestorage.app",
  messagingSenderId: "589276800182",
  appId: "1:589276800182:web:126a682a41d87ec15eb217"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

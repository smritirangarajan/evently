// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC_bXjorNtsf89_T-OTtdzkYdZ9YJy3LX8",
    authDomain: "evently-d0ef8.firebaseapp.com",
    projectId: "evently-d0ef8",
    storageBucket: "evently-d0ef8.firebasestorage.app",
    messagingSenderId: "804135861360",
    appId: "1:804135861360:web:a907c5cd84f295a15688b5",
    measurementId: "G-TMF203ZFTJ"
  };


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

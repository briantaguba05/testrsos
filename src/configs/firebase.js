// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD3XMpRjJFTsT5U97lowJvqDyO_ipjIKwg",
    authDomain: "rsos-705e9.firebaseapp.com",
    databaseURL: "https://rsos-705e9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rsos-705e9",
    storageBucket: "rsos-705e9.appspot.com",
    messagingSenderId: "733901279972",
    appId: "1:733901279972:web:fec79361ef80c248a052f1",
    measurementId: "G-H3H5T3WCL0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);

export const firestore = getFirestore(app);

export default app


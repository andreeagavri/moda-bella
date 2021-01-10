import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-id7FfQ5eMUQTHl0hk_RQbcP7R6C5jnk",
  authDomain: "moda-bella-d08a3.firebaseapp.com",
  databaseURL:
    "https://moda-bella-d08a3-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "moda-bella-d08a3",
  storageBucket: "moda-bella-d08a3.appspot.com",
  messagingSenderId: "851500071831",
  appId: "1:851500071831:web:bf0a2f73f81dc3c0ba62d2",
  measurementId: "G-5BJC94VNJY",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();

export { app, auth, db };

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDabNPpYiLOuSq8YH6R3Uq9R9merr73VA4",
  authDomain: "parkease-53769.firebaseapp.com",
  projectId: "parkease-53769",
  storageBucket: "parkease-53769.appspot.com",
  messagingSenderId: "862779861874",
  appId: "1:862779861874:web:f3f3f44c06bf5ef5408beb"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB
const db = getFirestore(app);

// Export
export { db, collection, addDoc, serverTimestamp };
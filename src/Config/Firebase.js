import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore,addDoc, collection, getDocs, doc, } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABV5PfzYYE1E3xXL3Ni_0rhNMSQ_ITVcE",
  authDomain: "project-ff47f.firebaseapp.com",
  projectId: "project-ff47f",
  storageBucket: "project-ff47f.firebasestorage.app",
  messagingSenderId: "380825667883",
  appId: "1:380825667883:web:acf07591d4951e537edd6e",
  measurementId: "G-KBP0MPJRMJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db,   };
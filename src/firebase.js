// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"; // Correct import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7LImijf1HRqhdbnDveEWofJvNlEXLJhM",
  authDomain: "photofolio-3d192.firebaseapp.com",
  projectId: "photofolio-3d192",
  storageBucket: "photofolio-3d192.firebasestorage.app",
  messagingSenderId: "243849541764",
  appId: "1:243849541764:web:5349ae865c493a9234ead1",
  measurementId: "G-LY4PT1WM7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database instance
const db = getFirestore(app);

export default db;
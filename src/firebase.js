import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvReTJpJfGJ1oGV-x2T5wcYQyxHBWj69E",
  authDomain: "project-management-89304.firebaseapp.com",
  projectId: "project-management-89304",
  storageBucket: "project-management-89304.firebasestorage.app",
  messagingSenderId: "512047219730",
  appId: "1:512047219730:web:d54f5da779e70801dd04cb",
  measurementId: "G-91LBX2693S"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
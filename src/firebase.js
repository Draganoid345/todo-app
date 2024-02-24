// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt1XdezjkgzAGpUkHJVWyIHedvcgUPEQ8",
  authDomain: "todo-app-3170e.firebaseapp.com",
  projectId: "todo-app-3170e",
  storageBucket: "todo-app-3170e.appspot.com",
  messagingSenderId: "1031658963862",
  appId: "1:1031658963862:web:cc3dba3c8bd9a23cde13b7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

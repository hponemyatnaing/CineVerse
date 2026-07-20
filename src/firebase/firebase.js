import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpNc6LWeUKHfBZQF1tVYf8olUe2f1fLRk",
  authDomain: "cineverse-final-92fa2.firebaseapp.com",
  projectId: "cineverse-final-92fa2",
  storageBucket: "cineverse-final-92fa2.firebasestorage.app",
  messagingSenderId: "1035963107530",
  appId: "1:1035963107530:web:f462dff70bebd609378c33"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// 🔥 AUTH EXPORT
export const auth = getAuth(app);
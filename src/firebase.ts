import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBdtYZIJCWH8ZLBgfzMZvW3VaG53KYlyY",
  authDomain: "nirvana-nails.firebaseapp.com",
  projectId: "nirvana-nails",
  storageBucket: "nirvana-nails.firebasestorage.app",
  messagingSenderId: "637956189342",
  appId: "1:637956189342:web:84e288baae4ab602e15f8f",
  measurementId: "G-WKDENXF7C9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

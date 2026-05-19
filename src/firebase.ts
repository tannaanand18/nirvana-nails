// Firestore-only app (passwordless login via AuthContext). No Firebase Auth SDK.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

const hasRequiredKeys = Boolean(
  firebaseConfig.apiKey?.trim() &&
    firebaseConfig.projectId?.trim() &&
    firebaseConfig.appId?.trim()
);

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

if (hasRequiredKeys) {
  try {
    const cfg = {
      apiKey: firebaseConfig.apiKey!,
      authDomain: firebaseConfig.authDomain?.trim() || `${firebaseConfig.projectId}.firebaseapp.com`,
      projectId: firebaseConfig.projectId!,
      storageBucket: firebaseConfig.storageBucket?.trim() || `${firebaseConfig.projectId}.appspot.com`,
      messagingSenderId: firebaseConfig.messagingSenderId?.trim() || "",
      appId: firebaseConfig.appId!,
    };
    app = getApps().length === 0 ? initializeApp(cfg) : getApp();
    dbInstance = getFirestore(app);
  } catch (e) {
    console.error("[Nirvana Nails] Firebase init failed:", e);
  }
} else {
  console.warn("[Nirvana Nails] Set VITE_FIREBASE_* env vars to enable Firestore.");
}

export const isFirebaseConfigured = Boolean(app && dbInstance);
export const firebaseApp = app;
export const db: Firestore | null = dbInstance;
export default firebaseApp;

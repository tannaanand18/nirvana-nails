// src/utils/checkAdmin.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * checkAdmin(uid) -> returns true if user's role === "admin"
 */
export const checkAdmin = async (uid: string) => {
  if (!db) return false;
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    const data = snap.data();
    return data?.role === "admin";
  } catch (e) {
    console.error("checkAdmin error:", e);
    return false;
  }
};

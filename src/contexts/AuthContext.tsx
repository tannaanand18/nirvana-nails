import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/firebase";
import type { AppUser } from "@/types/models";
import { COLLECTIONS } from "@/lib/dbSeed";
import { emailToUserId, isAdminEmail, normalizeEmail } from "@/lib/userId";

const STORAGE_KEY = "nirvana_user";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  login: (name: string, email: string, password?: string) => Promise<AppUser>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

function saveUser(user: AppUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => loadStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sync = async () => {
      const stored = loadStoredUser();
      if (!stored || !db) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, COLLECTIONS.users, stored.id));
        if (snap.exists()) {
          const data = snap.data();
          const fresh: AppUser = {
            id: stored.id,
            name: data.name as string,
            email: data.email as string,
            role: data.role as AppUser["role"],
            createdAt: data.createdAt as string,
          };
          setUser(fresh);
          saveUser(fresh);
        }
      } catch {
        /* keep local session */
      }
      setLoading(false);
    };
    void sync();
  }, []);

  const login = useCallback(async (name: string, email: string, password?: string) => {
    if (!db || !isFirebaseConfigured) {
      throw new Error("Firebase is not configured.");
    }
    const trimmedName = name.trim();
    const normalized = normalizeEmail(email);
    if (!trimmedName || !normalized.includes("@")) {
      throw new Error("Please enter your name and a valid email.");
    }

    const id = emailToUserId(normalized);
    let role: AppUser["role"] = "user";
    if (isAdminEmail(normalized)) {
      const adminPassword = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? "";
      if (!adminPassword) {
        throw new Error("Admin password not configured. Contact site owner.");
      }
      if (password !== adminPassword) {
        throw new Error("Invalid admin password.");
      }
      role = "admin";
    }
    const appUser: AppUser = {
      id,
      name: trimmedName,
      email: normalized,
      role,
      createdAt: new Date().toISOString(),
    };

    await setDoc(
      doc(db, COLLECTIONS.users, id),
      {
        name: trimmedName,
        email: normalized,
        role,
        createdAt: appUser.createdAt,
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );

    setUser(appUser);
    saveUser(appUser);
    return appUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAdmin: user?.role === "admin",
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

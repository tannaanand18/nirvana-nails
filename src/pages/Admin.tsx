// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { auth, isFirebaseConfigured } from "../firebase";
import { checkAdmin } from "../utils/checkAdmin";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsAdmin(false);
      return;
    }

    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }
      checkAdmin(user.uid).then((res) => {
        if (!res) {
          alert("Unauthorized access");
          window.location.href = "/";
        } else {
          setIsAdmin(true);
        }
      });
    });
    return () => unsub();
  }, []);

  if (!isFirebaseConfigured || !auth) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-36 sm:pt-40 container mx-auto px-4 max-w-lg text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Admin unavailable</h1>
          <p className="text-muted-foreground text-sm">
            Configure Firebase <code className="text-gold">VITE_FIREBASE_*</code> in Vercel and redeploy.
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  if (isAdmin === null) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 container mx-auto px-4">Checking admin access…</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-8 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-muted-foreground text-sm sm:text-base">
          Manage services & gallery. (Admin only)
        </p>
      </section>

      <Footer />
    </main>
  );
};

export default Admin;

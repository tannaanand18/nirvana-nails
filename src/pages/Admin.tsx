// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { auth } from "../firebase";
import { checkAdmin } from "../utils/checkAdmin";

/**
 * Minimal admin shell.
 * You can later paste your full Admin UI (services/gallery) inside the return
 * once the role-check passes.
 */
const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
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

  if (isAdmin === null) return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 container mx-auto px-4">Checking admin access…</div>
      <Footer />
    </main>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-32 pb-8 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-muted-foreground text-sm sm:text-base">Manage services & gallery. (Admin only)</p>
      </section>

      {/* You can paste your full admin forms and lists here.
          For clarity I leave the UI minimal — but you already have Admin UI (services/gallery).
          If you want, I can merge your existing Admin components into this protected shell. */}

      <Footer />
    </main>
  );
};

export default Admin;

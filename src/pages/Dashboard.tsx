import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import type { User } from "firebase/auth";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<
    { id: string; service?: string; date?: string; time?: string; notes?: string; status?: string }[]
  >([]);

  useEffect(() => {
    let unsubFirestore: (() => void) | undefined;

    const unsubAuth = auth.onAuthStateChanged((u) => {
      unsubFirestore?.();
      unsubFirestore = undefined;
      setAppointments([]);

      if (!u) {
        setUser(null);
        navigate("/login", { replace: true });
        return;
      }

      setUser(u);
      const q = query(collection(db, "appointments"), where("userId", "==", u.uid));
      unsubFirestore = onSnapshot(q, (snap) =>
        setAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
    });

    return () => {
      unsubAuth();
      unsubFirestore?.();
    };
  }, [navigate]);

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Redirecting…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Seo title={`My appointments – ${SALON_NAME}`} description="View your booking requests." path="/dashboard" noIndex />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 container mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">My appointments</h1>

        {appointments.length === 0 && (
          <p className="text-muted-foreground mb-6">No appointments yet 💅</p>
        )}

        <div className="space-y-4 max-w-2xl">
          {appointments.map((a) => (
            <div key={a.id} className="border rounded-xl p-4 bg-card/40">
              <p className="font-semibold">{a.service}</p>
              <p className="text-sm mt-1">
                {a.date} — {a.time}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{a.notes || "No notes added"}</p>
              <p className="text-sm mt-2 font-medium">
                Status:{" "}
                <span
                  className={
                    a.status === "Pending"
                      ? "text-yellow-500"
                      : a.status === "Approved"
                        ? "text-green-500"
                        : "text-red-500"
                  }
                >
                  {a.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Dashboard;

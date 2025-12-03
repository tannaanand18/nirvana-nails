import { useState, useEffect } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        alert("Please login first");
        window.location.href = "/login";
      }
      setUser(u);

      const q = query(
        collection(db, "appointments"),
        where("userId", "==", u.uid)
      );

      onSnapshot(q, (snap) =>
        setAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
    });

    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-12 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-4">
          My Appointments
        </h1>

        {appointments.length === 0 && (
          <p className="text-muted-foreground">No appointments yet 💅</p>
        )}

        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a.id} className="border rounded-xl p-4 bg-card/40">
              <p className="font-semibold">{a.service}</p>
              <p className="text-sm mt-1">
                {a.date} — {a.time}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {a.notes || "No notes added"}
              </p>
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

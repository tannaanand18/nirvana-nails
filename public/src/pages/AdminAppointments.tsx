import { useState, useEffect } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  // 🔐 Protect admin page
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("Please login first");
        window.location.href = "/login";
      }
    });
    return () => unsub();
  }, []);

  // 📌 Get all appointments live
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "appointments"), (snap) =>
      setAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  // ✔ Approve
  const approveBooking = async (id: string) => {
    await updateDoc(doc(db, "appointments", id), { status: "Approved" });
  };

  // ❌ Cancel
  const cancelBooking = async (id: string) => {
    await updateDoc(doc(db, "appointments", id), { status: "Cancelled" });
  };

  // 🗑 Delete
  const deleteBooking = async (id: string) => {
    if (confirm("Delete appointment permanently?")) {
      await deleteDoc(doc(db, "appointments", id));
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-8 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-2">
          Appointments Manager
        </h1>
        <p className="text-muted-foreground">
          Approve / Cancel / Delete client bookings.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20 space-y-6">
        {appointments.length === 0 && (
          <p className="text-muted-foreground">No appointments yet 💅</p>
        )}

        {appointments.map((a) => (
          <div
            key={a.id}
            className="border rounded-xl p-6 bg-card/40 shadow-sm"
          >
            <p className="text-lg font-semibold">{a.service}</p>
            <p className="text-sm mt-1 text-muted-foreground">
              {a.date} — {a.time}
            </p>

            <p className="mt-2">
              <span className="font-medium">Client:</span> {a.name}
            </p>
            <p className="text-sm">{a.email}</p>

            {a.notes && (
              <p className="text-xs text-muted-foreground mt-1">
                Notes: {a.notes}
              </p>
            )}

            <p className="text-sm mt-3 font-semibold">
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

            <div className="flex gap-3 mt-4">
              <Button
                size="sm"
                variant="glass"
                onClick={() => approveBooking(a.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => cancelBooking(a.id)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteBooking(a.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
};

export default AdminAppointments;

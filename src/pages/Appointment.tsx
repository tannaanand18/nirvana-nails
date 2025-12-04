import { useState, useEffect } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { auth, db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const Appointment = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        alert("Please login first");
        window.location.href = "/login";
      }
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "appointments"), {
        name: user.displayName || user.email,
        email: user.email,
        service: selectedService,
        date,
        time,
        notes,
        createdAt: Timestamp.now(),
        status: "Pending",
        userId: user.uid,
      });

      setSuccess(true);
      setSelectedService("");
      setDate("");
      setTime("");
      setNotes("");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      alert("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-12 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-4">Book Appointment</h1>

        <form onSubmit={handleSubmit} className="max-w-lg space-y-4 mx-auto">
          <input
            disabled
            className="w-full border rounded px-3 py-2 bg-muted"
            value={user?.email || ""}
          />

          <select
            className="w-full border rounded px-3 py-2"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="">Select Service</option>
            <option value="Gel Polish">Gel Polish</option>
            <option value="Nail Extensions">Nail Extensions</option>
            <option value="Nail Art">Nail Art</option>
            <option value="Press On Nails">Press On Nails</option>
            <option value="Combo Package">Combo Package</option>
            <option value="Bridal Nails">Bridal Nails</option>
          </select>

          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Notes (optional)"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Visibility Messages */}
          {loading && (
            <div className="text-center border border-yellow-400 bg-yellow-50 text-yellow-700 font-semibold py-3 rounded-md animate-pulse">
              ⏳ Submitting your appointment request…
            </div>
          )}

          {success && (
            <div className="text-center border border-green-500 bg-green-50 text-green-700 font-semibold py-3 rounded-md">
              ✔ Appointment request submitted successfully! Redirecting…
            </div>
          )}

          <Button variant="gold" type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit Request"}
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Appointment;

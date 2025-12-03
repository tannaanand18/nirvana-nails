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

    alert("Appointment request sent 🥰");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-12 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-4">
          Book Appointment
        </h1>
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
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

          <Button variant="gold" type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Appointment;

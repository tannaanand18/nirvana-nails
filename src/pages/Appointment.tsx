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
    <main className="min-h-screen bg-background text-white">
      <Navbar />

      <section className="pt-32 pb-16 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-8 text-center">
          Book Appointment
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-card/60 p-8 rounded-xl shadow-xl space-y-5 border border-gold/20"
        >
          {/* Email */}
          <label className="text-sm font-medium">Email</label>
          <input
            disabled
            value={user?.email || ""}
            className="w-full px-3 py-2 rounded bg-zinc-800/60 border border-zinc-700 text-white"
          />

          {/* Service */}
          <label className="text-sm font-medium">Select Service</label>
          <select
            className="w-full px-3 py-2 rounded bg-zinc-800/60 border border-zinc-700 text-white focus:ring-2 focus:ring-gold focus:outline-none"
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

          {/* Date */}
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded bg-zinc-800/60 border border-zinc-700 text-white focus:ring-2 focus:ring-gold focus:outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* Time */}
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            className="w-full px-3 py-2 rounded bg-zinc-800/60 border border-zinc-700 text-white focus:ring-2 focus:ring-gold focus:outline-none"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          {/* Notes */}
          <label className="text-sm font-medium">Notes (optional)</label>
          <textarea
            rows={3}
            placeholder="Anything you want to mention..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded bg-zinc-800/60 border border-zinc-700 text-white focus:ring-2 focus:ring-gold focus:outline-none"
          />

          <Button variant="gold" type="submit" className="w-full py-3 text-base">
            Submit Appointment
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Appointment;

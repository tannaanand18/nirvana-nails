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
      <section className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-10 text-center">
          Book Appointment
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-card/50 backdrop-blur-lg border border-gold/30 shadow-xl p-8 rounded-2xl space-y-6"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              disabled
              className="w-full rounded-lg px-3 py-2 bg-muted/40 border border-border/40 text-white cursor-not-allowed"
              value={user?.email || ""}
            />
          </div>

          {/* Service */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Service</label>
            <select
              className="w-full rounded-lg px-3 py-2 bg-background/40 border border-border/40 text-white focus:ring-2 focus:ring-gold/40"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value="" className="text-black">Select Service</option>
              <option value="Gel Polish" className="text-black">Gel Polish</option>
              <option value="Nail Extensions" className="text-black">Nail Extensions</option>
              <option value="Nail Art" className="text-black">Nail Art</option>
              <option value="Press On Nails" className="text-black">Press On Nails</option>
              <option value="Combo Package" className="text-black">Combo Package</option>
              <option value="Bridal Nails" className="text-black">Bridal Nails</option>
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <input
              type="date"
              className="w-full rounded-lg px-3 py-2 bg-background/40 border border-border/40 text-white focus:ring-2 focus:ring-gold/40"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time</label>
            <input
              type="time"
              className="w-full rounded-lg px-3 py-2 bg-background/40 border border-border/40 text-white focus:ring-2 focus:ring-gold/40"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              className="w-full rounded-lg px-3 py-2 bg-background/40 border border-border/40 text-white focus:ring-2 focus:ring-gold/40"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to mention..."
            />
          </div>

          <Button variant="gold" type="submit" className="w-full py-3 text-base">
            Submit Request
          </Button>
        </form>
      </section>
      <Footer />
    </main>
  );
};

export default Appointment;

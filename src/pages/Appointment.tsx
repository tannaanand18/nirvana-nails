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
      } else {
        setUser(u);
      }
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

    alert("Appointment request submitted successfully 🥰");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold mb-8 text-center">
          Book Appointment
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-5 bg-card/30 backdrop-blur-md p-8 rounded-2xl border border-gold/20 shadow-lg"
        >
          {/* Email field */}
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-muted text-muted-foreground"
              value={user?.email || ""}
            />
          </div>

          {/* Select Service */}
          <div>
            <label className="text-sm font-medium mb-1 block">Select Service*</label>
            <select
              className="w-full border rounded-lg px-4 py-3 bg-background"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value="">-- Choose a service --</option>
              <option value="Gel Polish">Gel Polish</option>
              <option value="Nail Extensions">Nail Extensions</option>
              <option value="Nail Art">Nail Art</option>
              <option value="Press On Nails">Press On Nails</option>
              <option value="Combo Package">Combo Package</option>
              
            </select>
          </div>

          {/* Date field */}
          <div>
            <label className="text-sm font-medium mb-1 block">Date*</label>
            <input
              type="date"
              className="w-full border rounded-lg px-4 py-3 bg-background"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time field */}
          <div>
            <label className="text-sm font-medium mb-1 block">Time*</label>
            <input
              type="time"
              className="w-full border rounded-lg px-4 py-3 bg-background"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium mb-1 block">Notes (optional)</label>
            <textarea
              className="w-full border rounded-lg px-4 py-3 bg-background resize-none"
              placeholder="Describe your preferred design / color / reference etc."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button variant="gold" type="submit" className="w-full py-3 text-base">
            Submit Appointment Request
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Appointment;

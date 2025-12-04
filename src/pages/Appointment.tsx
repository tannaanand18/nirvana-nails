// src/pages/Appointment.tsx
import { useState, useEffect } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { auth, db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";

const WHATSAPP_NUMBER = "919512267420";

const Appointment = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const inputClass =
    "w-full rounded-md border border-border bg-card/80 px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold";

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const btn = (e.target as HTMLFormElement).querySelector("button");
    if (btn) btn.disabled = true;

    // 1️⃣ Save to Firestore (only once)
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

    // 2️⃣ Send Email Notification (only once)
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: user.displayName || user.email,
        email: user.email,
        service: selectedService,
        date,
        time,
        notes: notes || "—",
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    // 3️⃣ Open WhatsApp in new tab
    const msg = `Hi Nirvana Nails 💅,

New appointment request:

Name: ${user.displayName || user.email}
Email: ${user.email}
Service: ${selectedService}
Date: ${date}
Time: ${time}
Notes: ${notes || "—"}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");

    alert("Appointment submitted successfully 🥰");
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
          className="max-w-xl mx-auto bg-card/60 p-8 rounded-2xl shadow-lg space-y-5 border border-border/60"
        >
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <input
              disabled
              className={`${inputClass} bg-muted cursor-not-allowed`}
              value={user?.email || ""}
            />
          </div>

          {/* Service */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Select Service</label>
            <select
              className={inputClass}
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
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Select Date</label>
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Select Time</label>
            <input
              type="time"
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Notes (optional)</label>
            <textarea
              className={inputClass}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to mention…"
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="gold"
            type="submit"
            className="w-full text-base py-3"
            disabled={!selectedService || !date || !time}
          >
            Submit Request & Open WhatsApp
          </Button>
        </form>
      </section>
      <Footer />
    </main>
  );
};

export default Appointment;

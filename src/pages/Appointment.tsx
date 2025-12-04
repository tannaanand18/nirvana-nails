// src/pages/Appointment.tsx

import { useState, useEffect } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { auth, db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const WHATSAPP_NUMBER = "919512267420"; // 👈 your Rajkot number with country code

const Appointment = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // Common input style (dark + gold focus)
  const inputClass =
    "w-full rounded-md border border-border bg-card/80 px-3 py-2 " +
    "text-foreground placeholder:text-muted-foreground " +
    "focus:outline-none focus:ring-2 focus:ring-gold";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("User not found, please login again.");
      window.location.href = "/login";
      return;
    }

    // 1️⃣ Save appointment in Firestore
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

    // 2️⃣ Build WhatsApp message
    const message = `Hi Nirvana Nails 💅,

New appointment request:

Name: ${user.displayName || user.email}
Email: ${user.email}
Service: ${selectedService}
Date: ${date}
Time: ${time}
Notes: ${notes || "—"}

Sent from the Nirvana Nails website.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    // 3️⃣ Open WhatsApp in new tab (mobile will open app)
    window.open(whatsappUrl, "_blank");

    // 4️⃣ Show confirmation + redirect
    alert("Appointment request sent 🥰 We’ve opened WhatsApp with your details.");
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
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              disabled
              className={`${inputClass} bg-muted cursor-not-allowed`}
              value={user?.email || ""}
            />
          </div>

          {/* Service */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              Select Service
            </label>
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
            <label className="text-sm font-medium text-muted-foreground">
              Select Date
            </label>
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
            <label className="text-sm font-medium text-muted-foreground">
              Select Time
            </label>
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
            <label className="text-sm font-medium text-muted-foreground">
              Notes (optional)
            </label>
            <textarea
              className={inputClass}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to mention…"
            />
          </div>

          <Button variant="gold" type="submit" className="w-full text-base py-3">
            Submit Request & Open WhatsApp
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Appointment;

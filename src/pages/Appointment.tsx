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

    alert("Your appointment request has been sent successfully 🥰");
    window.location.href = "/dashboard";
  };

  const inputStyle =
    "w-full border border-border/50 rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold transition";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="font-display text-center text-4xl sm:text-5xl font-bold mb-10">
          Book an Appointment 💅
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-card/70 backdrop-blur-md border border-border/40 rounded-2xl shadow-2xl p-8 space-y-5"
        >
          {/* Email */}
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">
              Email
            </label>
            <input
              disabled
              className={`${inputStyle} bg-muted cursor-not-allowed`}
              value={user?.email || ""}
            />
          </div>

          {/* Service */}
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">
              Choose Service
            </label>
            <select
              className={inputStyle}
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
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">
              Preferred Date
            </label>
            <input
              type="date"
              className={inputStyle}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">
              Preferred Time
            </label>
            <input
              type="time"
              className={inputStyle}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">
              Notes (optional)
            </label>
            <textarea
              className={`${inputStyle} min-h-[90px]`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to mention… (optional)"
            />
          </div>

          <Button
            variant="gold"
            type="submit"
            className="w-full text-base py-3 font-semibold"
          >
            Submit Appointment
          </Button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Appointment;

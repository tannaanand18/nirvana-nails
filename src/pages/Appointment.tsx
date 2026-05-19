// src/pages/Appointment.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { auth, db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { Seo } from "@/components/Seo";
import { SALON_NAME, whatsappLink } from "@/constants/salon";
import { MessageCircle, Calendar, User } from "lucide-react";

const SERVICE_OPTIONS = [
  "Gel Polish",
  "Nail Extensions",
  "Nail Art",
  "Press On Nails",
  "Combo Package",
  "Bridal Nails",
  "Manicure",
  "Pedicure",
  "Acrylic Nails",
] as const;

const inputClass =
  "w-full rounded-md border border-border bg-card/80 px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold";

const Appointment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState<"guest" | "account">("guest");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthReady(true);
      if (u) setMode("account");
      else setMode("guest");
    });
    return () => unsub();
  }, []);

  const buildWhatsAppBody = (prefix: string) =>
    `${prefix}

Service: ${selectedService}
Date: ${date}
Time: ${time}
Notes: ${notes || "—"}`;

  const submitGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim() || !selectedService || !date || !time) return;
    const msg = buildWhatsAppBody(
      `Hi ${SALON_NAME} 💅 — quick booking request:\n\nName: ${guestName}\nPhone: ${guestPhone}`
    );
    window.open(whatsappLink(msg), "_blank");
  };

  const submitAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedService || !date || !time) return;
    setSubmitting(true);
    const form = e.target as HTMLFormElement;
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;

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

      const sid = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const tid = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const pk = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      if (sid && tid && pk) {
        try {
          await emailjs.send(sid, tid, {
            name: user.displayName || user.email,
            email: user.email,
            service: selectedService,
            date,
            time,
            notes: notes || "—",
          }, pk);
        } catch (emailErr) {
          console.warn("EmailJS notification skipped:", emailErr);
        }
      }

      const msg = buildWhatsAppBody(
        `Hi ${SALON_NAME} 💅\n\nNew appointment request:\n\nName: ${user.displayName || user.email}\nEmail: ${user.email}`
      );
      window.open(whatsappLink(msg), "_blank");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Could not save the appointment. Please try WhatsApp or contact us directly.");
    } finally {
      setSubmitting(false);
      if (btn) btn.disabled = false;
    }
  };

  if (!authReady) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo
        title={`Book an appointment – ${SALON_NAME}`}
        description={`Request a slot at ${SALON_NAME}: gel, acrylics, nail art, manicures & pedicures in Rajkot.`}
        path="/appointment"
      />
      <Navbar />
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 container mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2 text-center">
          Book an appointment
        </h1>
        <p className="text-center text-muted-foreground text-sm max-w-lg mx-auto mb-8">
          Send a quick WhatsApp request without an account, or sign in to save your booking to your
          dashboard and optional email alerts.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            type="button"
            variant={mode === "guest" ? "gold" : "glass"}
            size="sm"
            onClick={() => setMode("guest")}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Quick (WhatsApp)
          </Button>
          <Button
            type="button"
            variant={mode === "account" ? "gold" : "glass"}
            size="sm"
            onClick={() => setMode("account")}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            With account
          </Button>
        </div>

        {mode === "account" && !user && (
          <p className="text-center text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            <Link to="/login" className="text-gold hover:underline">
              Sign in
            </Link>{" "}
            or{" "}
            <Link to="/register" className="text-gold hover:underline">
              create an account
            </Link>{" "}
            to save requests to your dashboard and get optional email confirmations.
          </p>
        )}

        {mode === "guest" && (
          <form
            onSubmit={submitGuest}
            className="max-w-xl mx-auto bg-card/60 p-6 sm:p-8 rounded-2xl shadow-lg space-y-5 border border-border/60"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Your name</label>
              <input
                className={inputClass}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Phone (WhatsApp)</label>
              <input
                className={inputClass}
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                required
                placeholder="+91 …"
                inputMode="tel"
              />
            </div>
            <ServiceFields
              inputClass={inputClass}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              notes={notes}
              setNotes={setNotes}
            />
            <Button
              variant="gold"
              type="submit"
              className="w-full text-base py-3 gap-2"
              disabled={!selectedService || !date || !time}
            >
              <MessageCircle className="w-4 h-4" />
              Open WhatsApp with details
            </Button>
          </form>
        )}

        {mode === "account" && user && (
          <form
            onSubmit={submitAccount}
            className="max-w-xl mx-auto bg-card/60 p-6 sm:p-8 rounded-2xl shadow-lg space-y-5 border border-border/60"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input disabled className={`${inputClass} bg-muted cursor-not-allowed`} value={user.email || ""} />
            </div>
            <ServiceFields
              inputClass={inputClass}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              notes={notes}
              setNotes={setNotes}
            />
            <Button
              variant="gold"
              type="submit"
              className="w-full text-base py-3 gap-2"
              disabled={!selectedService || !date || !time || submitting}
            >
              <Calendar className="w-4 h-4" />
              {submitting ? "Saving…" : "Save request, notify & WhatsApp"}
            </Button>
          </form>
        )}
      </section>
      <Footer />
    </main>
  );
};

function ServiceFields({
  inputClass,
  selectedService,
  setSelectedService,
  date,
  setDate,
  time,
  setTime,
  notes,
  setNotes,
}: {
  inputClass: string;
  selectedService: string;
  setSelectedService: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  return (
    <>
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Select service</label>
        <select
          className={inputClass}
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          required
        >
          <option value="">Select service</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Date</label>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Time</label>
          <input
            type="time"
            className={inputClass}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Notes (optional)</label>
        <textarea
          className={inputClass}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Design references, allergies, or preferred nail length…"
        />
      </div>
    </>
  );
}

export default Appointment;

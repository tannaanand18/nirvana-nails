import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Seo } from "@/components/Seo";
import { SALON_NAME, whatsappLink } from "@/constants/salon";
import { MessageCircle, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTreatments } from "@/hooks/useTreatments";
import { COLLECTIONS } from "@/lib/dbSeed";

const inputClass =
  "w-full rounded-md border border-border bg-card/80 px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold";

const Appointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { treatments, loading: treatmentsLoading } = useTreatments(true);

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [treatmentId, setTreatmentId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setGuestName(user.name);
    }
  }, [user]);

  const selectedTreatment = treatments.find((t) => t.id === treatmentId);

  const buildWhatsAppBody = (name: string, phone: string) =>
    `Hi ${SALON_NAME} 💅 — booking request:

Name: ${name}
Phone: ${phone}
Treatment: ${selectedTreatment?.name ?? "—"}
Date: ${date}
Time: ${time}
Notes: ${notes || "—"}`;

  const submitGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim() || !treatmentId || !date || !time) return;
    window.open(whatsappLink(buildWhatsAppBody(guestName, guestPhone)), "_blank");
  };

  const submitLoggedIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !treatmentId || !date || !time || !selectedTreatment) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, COLLECTIONS.appointments), {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        treatmentId,
        treatmentName: selectedTreatment.name,
        date,
        time,
        notes: notes || "",
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
      window.open(
        whatsappLink(buildWhatsAppBody(user.name, user.email)),
        "_blank"
      );
      navigate("/dashboard");
    } catch {
      alert("Could not save booking. Try WhatsApp or contact us.");
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo
        title={`Book – ${SALON_NAME}`}
        description="Book a nail treatment at Nirvana Nails."
        path="/appointment"
      />
      <Navbar />
      <section className="pt-28 sm:pt-32 pb-16 container mx-auto px-4 max-w-xl">
        <h1 className="font-display text-3xl font-bold mb-2 text-center">Book appointment</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          {user ? (
            <>Signed in as {user.name}. Your booking saves to your dashboard.</>
          ) : (
            <>
              <Link to="/login" className="text-gold hover:underline">
                Sign in
              </Link>{" "}
              to save bookings, or use quick WhatsApp below.
            </>
          )}
        </p>

        <form
          onSubmit={user ? submitLoggedIn : submitGuest}
          className="bg-card/60 p-6 sm:p-8 rounded-2xl shadow-lg space-y-5 border border-border/60"
        >
          {!user && (
            <>
              <Field label="Your name">
                <input
                  className={inputClass}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                />
              </Field>
              <Field label="WhatsApp phone">
                <input
                  className={inputClass}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  inputMode="tel"
                />
              </Field>
            </>
          )}

          <Field label="Treatment">
            <select
              className={inputClass}
              value={treatmentId}
              onChange={(e) => setTreatmentId(e.target.value)}
              required
              disabled={treatmentsLoading}
            >
              <option value="">Select treatment</option>
              {treatments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.price}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date">
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                className={inputClass}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea
              className={inputClass}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Design ideas, allergies…"
            />
          </Field>

          <Button
            variant="gold"
            type="submit"
            className="w-full gap-2"
            disabled={!treatmentId || !date || !time || submitting}
          >
            {user ? (
              <>
                <Calendar className="w-4 h-4" />
                {submitting ? "Saving…" : "Save & open WhatsApp"}
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Send via WhatsApp
              </>
            )}
          </Button>
        </form>
      </section>
      <Footer />
    </main>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export default Appointment;

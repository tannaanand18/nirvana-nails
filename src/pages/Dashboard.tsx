import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";
import { useAuth } from "@/contexts/AuthContext";
import { useTreatments } from "@/hooks/useTreatments";
import { useOffers } from "@/hooks/useOffers";
import { db } from "@/firebase";
import { COLLECTIONS } from "@/lib/dbSeed";
import type { Appointment } from "@/types/models";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { Sparkles, Tag, Calendar, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { treatments, loading: treatmentsLoading } = useTreatments(true);
  const { offers, loading: offersLoading } = useOffers(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true, state: { from: "/dashboard" } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!db || !user) return;
    const q = query(
      collection(db, COLLECTIONS.appointments),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) =>
      setAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment)))
    );
  }, [user]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={`My salon – ${SALON_NAME}`}
        description="Your treatments, offers and bookings"
        path="/dashboard"
        noIndex
      />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 container mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1">
          Hi, {user.name.split(" ")[0]} 💅
        </h1>
        <p className="text-muted-foreground text-sm mb-10">{user.email}</p>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Treatments
            </h2>
            <Button variant="glass" size="sm" asChild>
              <Link to="/appointment">
                Book <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          {treatmentsLoading ? (
            <p className="text-muted-foreground text-sm">Loading treatments…</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-border/50 bg-card/40 p-5 hover:border-gold/30 transition"
                >
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-gold text-sm font-medium mt-1">{t.price}</p>
                  {t.duration && (
                    <p className="text-xs text-muted-foreground mt-1">{t.duration}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{t.description}</p>
                  <Button variant="gold" size="sm" className="mt-4 w-full" asChild>
                    <Link to="/appointment">Book this</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {offers.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-semibold flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gold" />
              Current offers
            </h2>
            {offersLoading ? (
              <p className="text-muted-foreground text-sm">Loading offers…</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {offers.map((o) => (
                  <div key={o.id} className="rounded-xl border border-gold/25 bg-gold/5 p-5">
                    <span className="text-xs font-bold text-gold">{o.discountLabel}</span>
                    <h3 className="font-semibold mt-2">{o.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{o.description}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gold" />
            My appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-3 max-w-2xl">
              {appointments.map((a) => (
                <div key={a.id} className="rounded-xl border border-border/50 bg-card/30 p-4">
                  <p className="font-medium">{a.treatmentName}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.date} · {a.time}
                  </p>
                  <p className="text-sm mt-2">
                    Status:{" "}
                    <span
                      className={
                        a.status === "Approved"
                          ? "text-green-400"
                          : a.status === "Cancelled"
                            ? "text-red-400"
                            : "text-yellow-400"
                      }
                    >
                      {a.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default Dashboard;

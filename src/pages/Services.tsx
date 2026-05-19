import { Link } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";
import { useTreatments } from "@/hooks/useTreatments";
import { useOffers } from "@/hooks/useOffers";

const Services = () => {
  const { treatments, loading } = useTreatments(true);
  const { offers } = useOffers(true);

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={`Treatments – ${SALON_NAME}`}
        description="Gel nails, acrylics, nail art, manicures & pedicures."
        path="/services"
      />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
            Our <span className="text-gradient">treatments</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Sign in to see the same menu on your dashboard and book in one tap.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {loading && <p className="text-center text-muted-foreground">Loading…</p>}

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {treatments.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-border/40 bg-card/60 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h2 className="font-display text-xl font-semibold mb-1">{t.name}</h2>
                  <p className="text-sm font-medium text-gold mb-2">{t.price}</p>
                  <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
                  {t.duration && (
                    <p className="text-xs font-medium text-gold">Duration: {t.duration}</p>
                  )}
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Button variant="gold" className="w-full" asChild>
                    <Link to="/appointment">Book now</Link>
                  </Button>
                  <Button variant="glass" className="w-full" asChild>
                    <Link to="/login">Sign in to save bookings</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {offers.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold mb-6 text-center">Special offers</h2>
              <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
                {offers.map((o) => (
                  <div key={o.id} className="rounded-xl border border-gold/30 bg-gold/5 p-5 text-center">
                    <span className="text-xs font-bold text-gold">{o.discountLabel}</span>
                    <p className="font-semibold mt-2">{o.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{o.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;

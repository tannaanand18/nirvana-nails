import { Crown, Sparkles, Gem, Palette, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTreatments } from "@/hooks/useTreatments";

const icons = [Sparkles, Gem, Palette, Heart, Crown, Star];

export const ServicesSection = () => {
  const { treatments, loading } = useTreatments(true);

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass gold-border mb-4">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">Our Services</span>
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="text-foreground">Luxury </span>
            <span className="text-gradient">Treatments</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Indulge in our premium nail services, crafted with precision and care.
          </p>
        </div>

        {loading && <p className="text-center text-muted-foreground mb-6">Loading treatments…</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={treatment.id}
                className="group p-8 rounded-2xl bg-gradient-card border border-border/30 hover:border-gold/30 transition-all duration-500 hover:shadow-glow hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-light flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                  {treatment.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {treatment.description}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gold font-semibold">{treatment.price}</span>
                  <Link
                    to="/appointment"
                    className="text-muted-foreground text-sm group-hover:text-gold transition-colors shrink-0"
                  >
                    Book →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

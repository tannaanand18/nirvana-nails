import { useEffect, useState } from "react";
import { Sparkles, Gem, Palette, Heart, Crown, Star } from "lucide-react";
import { db } from "../../firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";

type Service = {
  id: string;
  name: string;
  price?: string;
  description?: string;
};

// we only use icons for UI, data comes from Firestore
const icons = [Sparkles, Gem, Palette, Heart, Crown, Star];

export const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        // get up to 6 services for homepage
        const q = query(collection(db, "services"), limit(6));
        const snap = await getDocs(q);
        const list = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Service)
        );
        setServices(list);
      } catch (err) {
        console.error("Error loading services for homepage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
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
            Indulge in our premium nail services, crafted with precision and care
            to give you the perfect nails you deserve.
          </p>
        </div>

        {/* Loading / empty states */}
        {loading && (
          <p className="text-center text-muted-foreground mb-6">
            Loading services…
          </p>
        )}

        {!loading && services.length === 0 && (
          <p className="text-center text-muted-foreground mb-6">
            No services added yet. Login to the admin panel to create your first
            service.
          </p>
        )}

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length]; // reuse icons in order

            return (
              <div
                key={service.id}
                className="group p-8 rounded-2xl bg-gradient-card border border-border/30 hover:border-gold/30 transition-all duration-500 hover:shadow-glow hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-light flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-300">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {service.description || "Beautiful nails, professionally done."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gold font-semibold">
                    {service.price && service.price.trim() !== ""
                      ? service.price
                      : "Contact for pricing"}
                  </span>
                  <a
                    href="/#contact"
                    className="text-muted-foreground text-sm group-hover:text-gold transition-colors"
                  >
                    Book Now →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type { ServiceCard } from "@/types/service";
import { DEFAULT_SERVICES } from "@/lib/defaultServices";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";

const Services = () => {
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ServiceCard));
        setServices(list);
      } catch (err) {
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    };
    getServices();
  }, []);

  const display = services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={`Services – ${SALON_NAME}`}
        description={`Gel nails, acrylics, nail art, manicures & pedicures at ${SALON_NAME} in Rajkot.`}
        path="/services"
      />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
            Our <span className="text-gradient">services</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            From simple gel polish to full bridal packages – pick your service, we’ll handle the
            glam ✨
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {loading && (
            <p className="text-center text-muted-foreground">Loading services…</p>
          )}

          {!loading && services.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              Showing our default menu. Connect Firestore in admin to publish live pricing and
              descriptions.
            </p>
          )}

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {display.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-border/40 bg-card/60 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h2 className="font-display text-xl font-semibold mb-1">{service.name}</h2>

                  <p className="text-sm font-medium text-gold mb-2">
                    {service.price && service.price.trim() !== ""
                      ? service.price
                      : "Contact for pricing"}
                  </p>

                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  )}

                  {Array.isArray(service.details) && service.details.length > 0 && (
                    <ul className="text-sm text-muted-foreground space-y-1 mb-3 list-disc list-inside">
                      {service.details.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {service.duration && (
                    <p className="text-xs font-medium text-gold">Approx. duration: {service.duration}</p>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Button variant="gold" className="w-full" asChild>
                    <Link to="/appointment">Book now</Link>
                  </Button>
                  <Button variant="glass" className="w-full" asChild>
                    <Link to="/contact">Ask a question</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Services;

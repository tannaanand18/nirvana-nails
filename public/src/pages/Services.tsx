import { useEffect, useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

type Service = {
  id: string;
  name: string;
  price?: string;
  description?: string;
  details?: string[];   // optional: bullet points
  duration?: string;    // optional: duration text
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));
        const list = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Service)
        );
        setServices(list);
      } catch (err) {
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    };
    getServices();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            From simple gel polish to full bridal packages – pick your service,
            we’ll handle the glam ✨
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading && (
            <p className="text-center text-muted-foreground">
              Loading services…
            </p>
          )}

          {!loading && services.length === 0 && (
            <p className="text-center text-muted-foreground">
              No services added yet. Login to the admin panel to create your first
              service.
            </p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-border/40 bg-card/60 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <h2 className="font-display text-xl font-semibold mb-1">
                    {service.name}
                  </h2>

                  <p className="text-sm font-medium text-gold mb-2">
                    {service.price && service.price.trim() !== ""
                      ? service.price
                      : "Contact for pricing"}
                  </p>

                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.description}
                    </p>
                  )}

                  {/* Optional bullet points if you add `details` array in Firestore */}
                  {Array.isArray(service.details) && service.details.length > 0 && (
                    <ul className="text-sm text-muted-foreground space-y-1 mb-3 list-disc list-inside">
                      {service.details.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {/* Optional duration */}
                  {service.duration && (
                    <p className="text-xs font-medium text-gold">
                      Approx. duration: {service.duration}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <a href="/#contact">
                    <Button variant="gold" className="w-full">
                      Book Now
                    </Button>
                  </a>
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

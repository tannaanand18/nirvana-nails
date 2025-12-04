import { Link } from "react-router-dom";
import { Button } from "./button";
import { Sparkles, Instagram, MessageCircle } from "lucide-react";
import heroImage from "@/assets/nails1.jpg";


const WHATSAPP_NUMBER = "919512267420";   
const INSTAGRAM_HANDLE = "nirvana_nails0409";

export const HeroSection = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Nirvana Nails 💅, I’d like to book an appointment."
  )}`;

  const instagramUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`;

  return (
    <section className="pt-28 pb-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-24 w-80 h-80 bg-purple-deep/25 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-deep/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass gold-border mb-5">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em]">
              Rajkot • Nail Studio
            </span>
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="block">Nails that feel</span>
            <span className="text-gradient">luxury, every day.</span>
          </h1>

          <p className="text-muted-foreground max-w-xl mb-6 text-sm sm:text-base">
            From minimal gel polish to full bridal sets – Nirvana Nails crafts
            custom designs that match your vibe, outfit and occasion. Hygienic,
            detail-obsessed and long-lasting.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="gold"
                size="lg"
                className="inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book on WhatsApp</span>
              </Button>
            </a>

            <Link to="/gallery">
              <Button variant="glass" size="lg">
                View Gallery
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@{INSTAGRAM_HANDLE}</span>
            </a>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Open daily • 8:00 PM – 12:00 PM</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-gold/30 bg-card/70 p-6 shadow-xl max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Featured look</p>
                <p className="font-medium text-sm">Soft glam nude set</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-gold/15 text-gold text-[11px] font-medium">
                Bridal friendly
              </span>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-muted">
  <img
    src={heroImage}
    alt="Nail Design"
    className="w-full h-full object-cover object-center"
  />
</div>





            <p className="text-xs text-muted-foreground mb-3">
              Lasts 3–4 weeks with proper care. Perfect for weddings,
              functions and shoots.
            </p>
            <p className="text-xs font-medium text-gold">
              Tap “Book on WhatsApp” to check availability today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

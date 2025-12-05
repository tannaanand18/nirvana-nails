import { Button } from "./button";
import { MessageCircle, Instagram, Clock, MapPin } from "lucide-react";
import { useState } from "react";

const WHATSAPP_NUMBER = "919512267420";
const INSTAGRAM_HANDLE = "nirvana_nails0409";

export const ContactSection = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const whatsappUrl = () => {
    const message = `Hi Nirvana Nails 💅,
I have an inquiry:

Name: ${name}
Message: ${text}

Sent from the website.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const instagramUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`;

  return (
    <section id="contact" className="py-16 bg-card/30 border-t border-border/30">
      <div className="container mx-auto px-4 grid gap-10 md:grid-cols-2 items-start">
        {/* Contact info */}
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Let&apos;s plan your <span className="text-gradient">next set</span>.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md">
            Share your outfit, occasion or inspiration photo – we&apos;ll help
            you choose the perfect nail style and book the right slot.
          </p>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 mt-0.5 text-gold" />
              <div>
                <p className="font-medium">WhatsApp for bookings</p>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  +91 95122 67420
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Instagram className="w-4 h-4 mt-0.5 text-gold" />
              <div>
                <p className="font-medium">Instagram</p>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  @{INSTAGRAM_HANDLE}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 mt-0.5 text-gold" />
              <div>
                <p className="font-medium">Working hours</p>
                <p className="text-muted-foreground">Daily • 8:00 PM – 12:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-gold" />
              <div>
                <p className="font-medium">Salon address</p>
                <p className="text-muted-foreground">
                  Rajkot, Gujarat · Full address shown after booking.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" className="inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </Button>
            </a>

            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="glass" className="inline-flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                View Instagram work
              </Button>
            </a>
          </div>
        </div>

        {/* Inquiry Form → WhatsApp redirect */}
        <div className="rounded-2xl border border-border/40 bg-background/80 p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-4">
            Prefer a form? Leave your details here — we will reply on WhatsApp instantly.
          </p>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name || !text) return;
              window.open(whatsappUrl(), "_blank");
            }}
          >
            <div>
              <label className="text-xs font-medium mb-1 block">Name</label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">
                How can we help?
              </label>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                rows={4}
                placeholder="Share your occasion, dates, and any nail inspiration."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="gold" className="w-full">
              Send enquiry via WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

import { MessageCircle, Instagram, Copyright } from "lucide-react";

const WHATSAPP_NUMBER = "919512267420";   
const INSTAGRAM_HANDLE = "nirvana_nails0409";

export const Footer = () => {
  const year = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Nirvana Nails 💅, I’d like to know more about your services."
  )}`;
  const instagramUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`;

  return (
    <footer className="border-t border-border/40 bg-background/90">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        {/* Brand */}
        <div>
          <p className="font-display text-lg font-semibold mb-1">Nirvana Nails</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Nail art, extensions and custom sets – created with care, hygiene and a lot
            of love for the details.
          </p>
        </div>

        {/* Quick info */}
        <div className="space-y-2">
          <p className="font-medium text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Studio Info
          </p>
          <p className="text-muted-foreground">
            Working hours: <span className="font-medium">8:00 PM – 12:00 PM</span>
          </p>
          <p className="text-muted-foreground">
            Address: <span>Your salon address here (update in code)</span>
          </p>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <p className="font-medium text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Connect
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book on WhatsApp</span>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@{INSTAGRAM_HANDLE}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div className="inline-flex items-center gap-1">
            <Copyright className="w-3 h-3" />
            <span>
              {year} Nirvana Nails. All rights reserved.
            </span>
          </div>
          <p className="text-[11px]">
            Made with care for clients who love beautiful nails 💅
          </p>
        </div>
      </div>
    </footer>
  );
};

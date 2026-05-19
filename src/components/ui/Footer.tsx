import { MessageCircle, Instagram, Copyright } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SALON_ADDRESS,
  SALON_HOURS,
  INSTAGRAM_HANDLE,
  SALON_NAME,
  instagramProfileUrl,
  whatsappLink,
} from "@/constants/salon";

export const Footer = () => {
  const year = new Date().getFullYear();
  const whatsappUrl = whatsappLink(
    "Hi Nirvana Nails 💅, I’d like to know more about your services."
  );
  const instagramUrl = instagramProfileUrl();

  return (
    <footer className="border-t border-border/40 bg-background/90">
      <div className="container mx-auto px-4 py-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-sm">
        <div className="lg:col-span-1">
          <p className="font-display text-lg font-semibold mb-1">{SALON_NAME}</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Nail art, extensions and custom sets – created with care, hygiene and a lot of love for
            the details.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Studio info
          </p>
          <p className="text-muted-foreground">
            Hours: <span className="font-medium text-foreground/90">{SALON_HOURS}</span>
          </p>
          <p className="text-muted-foreground">
            Address: <span className="text-foreground/90">{SALON_ADDRESS}</span>
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Quick links
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/services" className="text-muted-foreground hover:text-gold transition-colors">
              Services
            </Link>
            <Link to="/gallery" className="text-muted-foreground hover:text-gold transition-colors">
              Gallery
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-gold transition-colors">
              Contact
            </Link>
            <Link to="/appointment" className="text-muted-foreground hover:text-gold transition-colors">
              Book appointment
            </Link>
          </div>
        </div>

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
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Book on WhatsApp</span>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors"
            >
              <Instagram className="w-4 h-4 shrink-0" />
              <span>@{INSTAGRAM_HANDLE}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div className="inline-flex items-center gap-1">
            <Copyright className="w-3 h-3 shrink-0" />
            <span>
              {year} {SALON_NAME}. All rights reserved.
            </span>
          </div>
          <p className="text-[11px] text-center sm:text-right">
            Made with care for clients who love beautiful nails 💅
          </p>
        </div>
      </div>
    </footer>
  );
};

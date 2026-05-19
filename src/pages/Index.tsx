import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { HeroSection } from "../components/ui/HeroSection";
import { ServicesSection } from "../components/ui/ServicesSection";
import { AboutSection } from "../components/ui/AboutSection";
import { GalleryPreview } from "../components/ui/GalleryPreview";
import { ContactSection } from "../components/ui/ContactSection";
import { Footer } from "../components/ui/Footer";
import { ReviewsSection } from "../components/ui/ReviewsSection";
import { MessageCircle } from "lucide-react";
import { Seo } from "@/components/Seo";
import { SALON_NAME, whatsappLink } from "@/constants/salon";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname]);

  const whatsappUrl = whatsappLink(
    "Hi Nirvana Nails 👋, I’d like to book an appointment."
  );

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={`${SALON_NAME} – Luxury nail studio in Rajkot`}
        description="Gel nails, acrylics, nail art, manicures & pedicures at Nirvana Nails. Hygienic, detail-obsessed sets for weddings, events, and everyday glam."
        path="/"
      />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <GalleryPreview />
      <AboutSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 rounded-full bg-gold text-background p-4 shadow-xl hover:scale-105 transition-transform"
      >
        <span className="sr-only">Chat on WhatsApp</span>
        <MessageCircle className="w-6 h-6" />
      </a>
    </main>
  );
};

export default Index;

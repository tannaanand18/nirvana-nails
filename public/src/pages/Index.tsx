import { useEffect } from "react";
import { Navbar } from "../components/ui/Navbar";
import { HeroSection } from "../components/ui/HeroSection";
import { ServicesSection } from "../components/ui/ServicesSection";
import { AboutSection } from "../components/ui/AboutSection";
import { GalleryPreview } from "../components/ui/GalleryPreview";
import { ContactSection } from "../components/ui/ContactSection";
import { Footer } from "../components/ui/Footer";
import { ReviewsSection } from "../components/ui/ReviewsSection"; // ✅ NEW
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // ✅ change to your number

const Index = () => {
  useEffect(() => {
    document.title = "Nirvana Nails – Nail Art & Extensions";
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Nirvana Nails 👋, I’d like to book an appointment."
  )}`;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <GalleryPreview />
      <AboutSection />
      <ReviewsSection /> {/* ✅ New section for testimonials */}
      <ContactSection />
      <Footer />

      {/* ✅ Floating WhatsApp button */}
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

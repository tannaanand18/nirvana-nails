import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ContactSection } from "@/components/ui/ContactSection";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";

const Contact = () => {
  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={`Contact ${SALON_NAME}`}
        description={`Book ${SALON_NAME} in Rajkot — WhatsApp, Instagram, and enquiry form. Gel, acrylics, nail art, manicures & pedicures.`}
        path="/contact"
      />
      <Navbar />
      <div className="pt-24">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
};

export default Contact;

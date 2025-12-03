import { Button } from "../ui/button";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600",
    alt: "Elegant gel nail design",
  },
  {
    src: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=600",
    alt: "Artistic nail art",
  },
  {
    src: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600",
    alt: "French manicure",
  },
  {
    src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600",
    alt: "Modern nail design",
  },
];

export const GalleryPreview = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass gold-border mb-4">
              <ImageIcon className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Our Portfolio</span>
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">
              <span className="text-foreground">Featured </span>
              <span className="text-gradient">Designs</span>
            </h2>
          </div>
          <Button variant="glass" className="mt-6 md:mt-0" asChild>
            <Link to="/gallery">
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl overflow-hidden ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className="aspect-square">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-foreground font-medium text-sm">{image.alt}</p>
                </div>
              </div>
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 rounded-2xl transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

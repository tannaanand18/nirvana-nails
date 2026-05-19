import { Button } from "../ui/button";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { GALLERY_PLACEHOLDERS } from "@/data/galleryPlaceholders";

export const GalleryPreview = () => {
  return (
    <section id="gallery" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
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
          <Button variant="glass" className="shrink-0 w-fit" asChild>
            <Link to="/gallery">
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {GALLERY_PLACEHOLDERS.slice(0, 4).map((image, index) => (
            <div
              key={image.src}
              className={`group relative rounded-2xl overflow-hidden ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div className={index === 0 ? "aspect-square md:aspect-auto md:min-h-[280px]" : "aspect-square"}>
                <img
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={800}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-foreground font-medium text-sm">{image.alt}</p>
                </div>
              </div>
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 rounded-2xl transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

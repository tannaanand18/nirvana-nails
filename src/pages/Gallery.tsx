import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { GALLERY_PLACEHOLDERS } from "@/data/galleryPlaceholders";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";

type GalleryDoc = { id: string; imageUrl?: string; alt?: string };

const Gallery = () => {
  const [images, setImages] = useState<GalleryDoc[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getImages = async () => {
      try {
        const snapshot = await getDocs(collection(db, "gallery"));
        setImages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GalleryDoc)));
      } catch (e) {
        console.warn("Gallery Firestore load failed, using placeholders.", e);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    getImages();
  }, []);

  const displayImages: { id: string; imageUrl: string; alt: string }[] =
    images.length > 0
      ? images
          .filter((i) => i.imageUrl)
          .map((i) => ({
            id: i.id,
            imageUrl: i.imageUrl as string,
            alt: i.alt || "Nail design by Nirvana Nails",
          }))
      : GALLERY_PLACEHOLDERS.map((p, idx) => ({
          id: `placeholder-${idx}`,
          imageUrl: p.src,
          alt: p.alt,
        }));

  return (
    <main className="min-h-screen bg-background">
      <Seo
        title={`Nail gallery – ${SALON_NAME}`}
        description={`Browse gel, acrylic, and nail art looks from ${SALON_NAME}.`}
        path="/gallery"
      />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 text-center bg-gradient-hero px-4">
        <h1 className="font-display text-4xl sm:text-5xl font-bold">
          Nail <span className="text-gradient">gallery</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto mt-2 text-sm sm:text-base">
          Browse styles and book your favourite look.
        </p>
      </section>

      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4">
          {loading && (
            <p className="text-center text-muted-foreground mb-6">Loading gallery…</p>
          )}
          {!loading && displayImages.length === 0 && (
            <p className="text-center text-muted-foreground mb-6">No images to show yet.</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayImages.map((img) => (
              <button
                key={img.id}
                type="button"
                className="aspect-square rounded-xl overflow-hidden cursor-pointer relative text-left group border-0 p-0 bg-transparent"
                onClick={() => setSelectedImage(img.imageUrl)}
              >
                <img
                  src={img.imageUrl}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
          {!loading && images.length === 0 && displayImages.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
              Showing sample looks. Add your photos in the admin panel to replace these placeholders.
            </p>
          )}
          <div className="flex justify-center mt-10">
            <Button variant="gold" asChild>
              <Link to="/appointment">Book this style</Link>
            </Button>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged nail photo"
          onClick={() => setSelectedImage(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged gallery item"
            className="max-h-[85vh] w-auto max-w-full rounded-xl shadow-xl object-contain"
            decoding="async"
          />
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Gallery;

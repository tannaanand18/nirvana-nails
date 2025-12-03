import { useEffect, useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Gallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getImages = async () => {
      const snapshot = await getDocs(collection(db, "gallery"));
      setImages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    getImages();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 text-center bg-gradient-hero">
        <h1 className="font-display text-5xl font-bold">
          Nail <span className="text-gradient">Gallery</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto mt-2">
          Browse styles and book your favourite look.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer relative"
              onClick={() => setSelectedImage(img.imageUrl)}
            >
              <img
                src={img.imageUrl}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-h-[85vh] rounded-xl shadow-xl"
          />
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Gallery;

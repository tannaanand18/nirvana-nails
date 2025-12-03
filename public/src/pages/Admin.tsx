import { useState, useEffect } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

const Admin = () => {
  const [serviceForm, setServiceForm] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
  });

  const [galleryForm, setGalleryForm] = useState({
    id: "",
    category: "",
    imageUrl: "",
    alt: "",
  });

  const [services, setServices] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // 🔐 Only logged-in users can access admin
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("Please login first");
        window.location.href = "/login";
      }
    });
    return () => unsub();
  }, []);

  // 🔁 Live fetch from Firestore
  useEffect(() => {
    const unsubServices = onSnapshot(collection(db, "services"), (snap) =>
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubGallery = onSnapshot(collection(db, "gallery"), (snap) =>
      setGallery(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsubServices();
      unsubGallery();
    };
  }, []);

  // ➕ Add / Update service
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (serviceForm.id) {
      await updateDoc(doc(db, "services", serviceForm.id), {
        name: serviceForm.name,
        price: serviceForm.price,
        description: serviceForm.description,
      });
      alert("Service updated ✨");
    } else {
      await addDoc(collection(db, "services"), {
        name: serviceForm.name,
        price: serviceForm.price,
        description: serviceForm.description,
        createdAt: Timestamp.now(),
      });
      alert("Service added 🎉");
    }

    setServiceForm({ id: "", name: "", price: "", description: "" });
  };

  // ➕ Add / Update gallery
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (galleryForm.id) {
      await updateDoc(doc(db, "gallery", galleryForm.id), {
        category: galleryForm.category,
        imageUrl: galleryForm.imageUrl,
        alt: galleryForm.alt,
      });
      alert("Image updated ✨");
    } else {
      await addDoc(collection(db, "gallery"), {
        category: galleryForm.category,
        imageUrl: galleryForm.imageUrl,
        alt: galleryForm.alt,
        createdAt: Timestamp.now(),
      });
      alert("Image added 🎉");
    }

    setGalleryForm({ id: "", category: "", imageUrl: "", alt: "" });
  };

  // ❌ Delete service
  const handleDeleteService = async (id: string) => {
    if (confirm("Delete this service?")) {
      await deleteDoc(doc(db, "services", id));
      alert("Service deleted ❌");
    }
  };

  // ❌ Delete gallery item
  const handleDeleteGallery = async (id: string) => {
    if (confirm("Delete this image?")) {
      await deleteDoc(doc(db, "gallery", id));
      alert("Image deleted ❌");
    }
  };

  // Reusable input class (high visibility)
  const inputClass =
    "w-full rounded-md border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold";

  const textareaClass =
    "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-8 container mx-auto px-4">
        <h1 className="font-display text-4xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-muted-foreground text-sm sm:text-base">
          Manage services & gallery. All changes update on the live website
          immediately.
        </p>
      </section>

      {/* FORMS */}
      <section className="container mx-auto px-4 grid gap-10 md:grid-cols-2 pb-16">
        {/* Service Form */}
        <div className="rounded-2xl border border-border/50 bg-card/70 p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold mb-4">
            Add / Edit Service
          </h2>
          <form onSubmit={handleServiceSubmit} className="space-y-3">
            <input
              className={inputClass}
              placeholder="Service name (e.g. Gel Polish)"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
            <input
              className={inputClass}
              placeholder="Price (e.g. ₹1499)"
              value={serviceForm.price}
              onChange={(e) =>
                setServiceForm((p) => ({ ...p, price: e.target.value }))
              }
            />
            <textarea
              className={textareaClass}
              placeholder="Short description"
              rows={3}
              value={serviceForm.description}
              onChange={(e) =>
                setServiceForm((p) => ({ ...p, description: e.target.value }))
              }
            />
            <Button variant="gold" className="w-full" type="submit">
              {serviceForm.id ? "Update Service" : "Add Service"}
            </Button>
          </form>
        </div>

        {/* Gallery Form */}
        <div className="rounded-2xl border border-border/50 bg-card/70 p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold mb-4">
            Add / Edit Gallery Image
          </h2>
          <form onSubmit={handleGallerySubmit} className="space-y-3">
            <input
              className={inputClass}
              placeholder="Category (e.g. Gel Nails, Bridal, Nail Art)"
              value={galleryForm.category}
              onChange={(e) =>
                setGalleryForm((p) => ({ ...p, category: e.target.value }))
              }
              required
            />
            <input
              className={inputClass}
              placeholder="Image URL (from Unsplash / Cloudinary)"
              value={galleryForm.imageUrl}
              onChange={(e) =>
                setGalleryForm((p) => ({ ...p, imageUrl: e.target.value }))
              }
              required
            />
            <input
              className={inputClass}
              placeholder="Alt text (short description)"
              value={galleryForm.alt}
              onChange={(e) =>
                setGalleryForm((p) => ({ ...p, alt: e.target.value }))
              }
            />
            <Button variant="gold" className="w-full" type="submit">
              {galleryForm.id ? "Update Image" : "Add Image"}
            </Button>
          </form>
        </div>
      </section>

      {/* LISTS */}
      <section className="container mx-auto px-4 grid gap-10 md:grid-cols-2 pb-20">
        {/* Services List */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">
            Services
          </h2>
          {services.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No services yet. Add one using the form above.
            </p>
          )}
          {services.map((s) => (
            <div
              key={s.id}
              className="border border-border/60 rounded-xl p-4 mb-4 bg-card/70 shadow-sm"
            >
              <p className="font-semibold text-foreground">{s.name}</p>
              {s.price && (
                <p className="text-sm text-gold font-medium mt-1">
                  {s.price}
                </p>
              )}
              {s.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {s.description}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() =>
                    setServiceForm({
                      id: s.id,
                      name: s.name || "",
                      price: s.price || "",
                      description: s.description || "",
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDeleteService(s.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery List */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">
            Gallery
          </h2>
          {gallery.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No images yet. Add one using the form above.
            </p>
          )}
          {gallery.map((g) => (
            <div
              key={g.id}
              className="border border-border/60 rounded-xl p-4 mb-4 bg-card/70 shadow-sm"
            >
              <div className="mb-3 rounded-md overflow-hidden bg-muted">
                <img
                  src={g.imageUrl}
                  alt={g.alt}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
              <p className="font-semibold text-foreground">
                {g.category}
              </p>
              {g.alt && (
                <p className="text-xs text-muted-foreground mt-1">
                  {g.alt}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                <Button
                  size="sm"
                  variant="glass"
                  onClick={() =>
                    setGalleryForm({
                      id: g.id,
                      category: g.category || "",
                      imageUrl: g.imageUrl || "",
                      alt: g.alt || "",
                    })
                  }
                >
                  Edit
                </Button>
              </div>
              <Button
                size="sm"
                className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDeleteGallery(g.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Admin;

import {
  collection,
  doc,
  writeBatch,
  getDocs,
  setDoc,
  type Firestore,
} from "firebase/firestore";
import type { Offer, Treatment } from "@/types/models";

export const COLLECTIONS = {
  users: "users",
  treatments: "treatments",
  offers: "offers",
  appointments: "appointments",
  gallery: "gallery",
  reviews: "reviews",
} as const;

const DEFAULT_TREATMENTS: Omit<Treatment, "id">[] = [
  {
    name: "Nail Art",
    description: "Custom designs, chrome, French twists, and hand-painted details.",
    price: "From ₹499",
    duration: "60–90 min",
    active: true,
    sortOrder: 1,
  },
  {
    name: "Gel Nails",
    description: "Long-wearing gel polish with a high-gloss, chip-resistant finish.",
    price: "From ₹699",
    duration: "45–60 min",
    active: true,
    sortOrder: 2,
  },
  {
    name: "Acrylic Nails",
    description: "Strength, length, and sculpted acrylics for dramatic sets.",
    price: "From ₹899",
    duration: "90–120 min",
    active: true,
    sortOrder: 3,
  },
  {
    name: "Manicure",
    description: "Cuticle care, shaping, buffing, and polish or gel.",
    price: "From ₹399",
    duration: "30–45 min",
    active: true,
    sortOrder: 4,
  },
  {
    name: "Pedicure",
    description: "Soak, exfoliation, massage, and flawless toes.",
    price: "From ₹499",
    duration: "45–60 min",
    active: true,
    sortOrder: 5,
  },
  {
    name: "Bridal & Events",
    description: "Photo-ready sets for weddings, parties, and special occasions.",
    price: "Custom quote",
    duration: "2–3 hrs",
    active: true,
    sortOrder: 6,
  },
];

const DEFAULT_OFFERS: Omit<Offer, "id">[] = [
  {
    title: "First visit glow",
    description: "10% off your first gel or nail art booking this month.",
    discountLabel: "10% OFF",
    active: true,
    sortOrder: 1,
  },
  {
    title: "Bridal party",
    description: "Book 4+ sets for an event and get a complimentary nail care kit.",
    discountLabel: "Bridal deal",
    active: true,
    sortOrder: 2,
  },
  {
    title: "Weekday special",
    description: "Tuesday & Wednesday slots — ₹150 off manicure + gel combo.",
    discountLabel: "₹150 OFF",
    active: true,
    sortOrder: 3,
  },
];

async function deleteCollection(db: Firestore, name: string) {
  const snap = await getDocs(collection(db, name));
  if (snap.empty) return;
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  if (snap.size >= 500) await deleteCollection(db, name);
}

/** Wipes app collections and writes fresh treatments + offers. Does not delete Firebase Auth users. */
export async function resetAndSeedDatabase(db: Firestore) {
  for (const name of Object.values(COLLECTIONS)) {
    await deleteCollection(db, name);
  }

  const batch = writeBatch(db);

  DEFAULT_TREATMENTS.forEach((t, i) => {
    const ref = doc(collection(db, COLLECTIONS.treatments));
    batch.set(ref, { ...t, sortOrder: i + 1 });
  });

  DEFAULT_OFFERS.forEach((o, i) => {
    const ref = doc(collection(db, COLLECTIONS.offers));
    batch.set(ref, { ...o, sortOrder: i + 1 });
  });

  await batch.commit();
}

/** Seed only if collections are empty (safe first deploy). */
export async function seedIfEmpty(db: Firestore) {
  const treatments = await getDocs(collection(db, COLLECTIONS.treatments));
  if (!treatments.empty) return false;

  const batch = writeBatch(db);
  DEFAULT_TREATMENTS.forEach((t, i) => {
    const ref = doc(collection(db, COLLECTIONS.treatments));
    batch.set(ref, { ...t, sortOrder: i + 1 });
  });
  DEFAULT_OFFERS.forEach((o, i) => {
    const ref = doc(collection(db, COLLECTIONS.offers));
    batch.set(ref, { ...o, sortOrder: i + 1 });
  });
  await batch.commit();
  return true;
}

export async function ensureConfigDoc(db: Firestore) {
  await setDoc(doc(db, "config", "site"), {
    seededAt: new Date().toISOString(),
    version: 2,
  }, { merge: true });
}

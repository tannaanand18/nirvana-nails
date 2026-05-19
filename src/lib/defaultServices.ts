import type { ServiceCard } from "@/types/service";

/** Shown when Firestore has no `services` yet — keeps the marketing site complete. */
export const DEFAULT_SERVICES: ServiceCard[] = [
  {
    id: "default-nail-art",
    name: "Nail Art",
    description:
      "Custom designs, chrome, French twists, and hand-painted details tailored to your occasion.",
    price: "Contact for pricing",
  },
  {
    id: "default-gel",
    name: "Gel Nails",
    description:
      "Long-wearing gel polish and structured gel sets with a high-gloss, chip-resistant finish.",
    price: "Contact for pricing",
  },
  {
    id: "default-acrylic",
    name: "Acrylic Nails",
    description:
      "Strength, length, and shape with sculpted acrylics — ideal for dramatic sets and extensions.",
    price: "Contact for pricing",
  },
  {
    id: "default-manicure",
    name: "Manicure",
    description:
      "Cuticle care, shaping, buffing, and polish or gel — clean, precise, and spa-level comfort.",
    price: "Contact for pricing",
  },
  {
    id: "default-pedicure",
    name: "Pedicure",
    description:
      "Soak, exfoliation, callus care, massage, and flawless toes — perfect for events and self-care.",
    price: "Contact for pricing",
  },
  {
    id: "default-bridal",
    name: "Bridal & Events",
    description:
      "Coordinated bridal parties, trials, and photo-ready sets that last through your big day.",
    price: "Contact for pricing",
  },
];

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { COLLECTIONS } from "@/lib/dbSeed";
import type { Offer } from "@/types/models";

export function useOffers(activeOnly = true) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const q = activeOnly
          ? query(
              collection(db, COLLECTIONS.offers),
              where("active", "==", true),
              orderBy("sortOrder", "asc")
            )
          : query(collection(db, COLLECTIONS.offers), orderBy("sortOrder", "asc"));

        const snap = await getDocs(q);
        setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Offer)));
      } catch (e) {
        console.warn("Offers load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [activeOnly]);

  return { offers, loading };
}

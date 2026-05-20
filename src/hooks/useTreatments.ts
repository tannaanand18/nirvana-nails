import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { COLLECTIONS } from "@/lib/dbSeed";
import { isLearningCourseName } from "@/lib/learningCourses";
import type { Treatment } from "@/types/models";
import { DEFAULT_SERVICES } from "@/lib/defaultServices";

export function useTreatments(activeOnly = true) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setTreatments(
        DEFAULT_SERVICES.map((s, i) => ({
          id: s.id,
          name: s.name,
          description: s.description ?? "",
          price: s.price ?? "Contact for pricing",
          duration: s.duration,
          active: true,
          sortOrder: i + 1,
        }))
      );
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const q = activeOnly
          ? query(
              collection(db, COLLECTIONS.treatments),
              where("active", "==", true),
              orderBy("sortOrder", "asc")
            )
          : query(collection(db, COLLECTIONS.treatments), orderBy("sortOrder", "asc"));

        const snap = await getDocs(q);
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Treatment))
          .filter((treatment) => !isLearningCourseName(treatment.name));
        setTreatments(list.length > 0 ? list : fallbackFromDefaults());
      } catch (e) {
        console.warn("Treatments load failed:", e);
        setTreatments(fallbackFromDefaults());
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [activeOnly]);

  return { treatments, loading };
}

function fallbackFromDefaults(): Treatment[] {
  return DEFAULT_SERVICES.filter((service) => !isLearningCourseName(service.name)).map((s, i) => ({
    id: s.id,
    name: s.name,
    description: s.description ?? "",
    price: s.price ?? "Contact for pricing",
    duration: s.duration,
    active: true,
    sortOrder: i + 1,
  }));
}

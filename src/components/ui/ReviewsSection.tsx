import { useEffect, useState } from "react";
import { db } from "../../firebase"; // fixed import
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;

    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("approved", "==", true),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => d.data());
        setReviews(data);
      } catch (err) {
        console.warn("Reviews could not be loaded:", err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-16 bg-card/40 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Client <span className="text-gradient">Love</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Verified reviews from real clients who trusted Nirvana Nails 💅
          </p>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            ⭐ Reviews will appear here after approval.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="rounded-2xl bg-background/80 border border-border/40 p-6 flex flex-col justify-between"
              >
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  “{review.text}”
                </p>
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-gold mt-1">{review.label}</p>

                  {/* ⭐ rating */}
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-gold text-lg">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

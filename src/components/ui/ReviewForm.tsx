import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase"; // fixed import
import { Star } from "lucide-react";

export const ReviewForm = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await addDoc(collection(db, "reviews"), {
      name,
      text,
      label,
      rating,
      approved: false, // ⭐ will show only after admin approves
      createdAt: new Date(),
    });

    alert("Thank you for your review! It will appear after approval ❤️");

    // reset form
    setName("");
    setText("");
    setLabel("");
    setRating(0);
    setLoading(false);
  };

  return (
    <form
      className="rounded-2xl border border-border/40 bg-background/80 p-6 shadow-sm space-y-4 mt-12"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-semibold mb-2">Leave a Review 💬</h3>

      <input
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        placeholder="Your Name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        placeholder="Your experience with Nirvana Nails 💅"
        rows={4}
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        placeholder="Service (Bridal Nails / Nail Extensions / Nail Art etc)"
        value={label}
        required
        onChange={(e) => setLabel(e.target.value)}
      />

      {/* ⭐ rating system */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => setRating(star)}
            className={`w-6 h-6 cursor-pointer ${
              rating >= star ? "text-gold fill-gold" : "text-border"
            }`}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-2 rounded-lg transition"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

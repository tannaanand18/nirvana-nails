export const ReviewsSection = () => {
  const reviews = [
    {
      name: "Riya Shah",
      text: "My bridal nails were PERFECT. They matched my lehenga exactly and didn’t chip at all.",
      label: "Bridal Package",
    },
    {
      name: "Krisha Patel",
      text: "I showed a Pinterest photo and she recreated it even better. Super gentle and hygienic.",
      label: "Nail Art + Extensions",
    },
    {
      name: "Simran Mehta",
      text: "I keep coming back every month. The gel polish lasts long and looks fresh till my next visit.",
      label: "Regular Gel Polish",
    },
  ];

  return (
    <section className="py-16 bg-card/40 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Client <span className="text-gradient">Love</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Real stories from clients who trusted Nirvana Nails for their big days
            and everyday glam.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl bg-background/80 border border-border/40 p-6 flex flex-col justify-between"
            >
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                “{review.text}”
              </p>
              <div>
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-xs text-gold mt-1">{review.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

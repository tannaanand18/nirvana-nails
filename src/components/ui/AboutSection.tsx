import { Award, Heart, Sparkles, Star } from "lucide-react";
import founderImg from "@/assets/founder.jpg"; // ✔ your imported image

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-deep/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Founder Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] gold-border">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
              <img
                src={founderImg}
                alt="Founder - Dr. Chandni Tanna"
                className="w-full h-full object-cover"
              />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="glass rounded-xl p-4 gold-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        Dr. Chandni Tanna
                      </p>
                      <p className="text-sm text-gold">Founder & Master Nail Artist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-gold/30 rounded-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-purple-light/30 rounded-3xl" />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass gold-border mb-6">
              <Heart className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Meet Our Founder</span>
            </span>

            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-foreground">Passion for </span>
              <span className="text-gradient">Perfection</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">
              With a vision to redefine nail artistry, <b>Dr. Chandni Tanna</b>
               built Nirvana Nails as a luxury space where creativity, hygiene, and
              premium care come together. Her expertise in nail extensions,
              bridal nail designs, and long-lasting gel finishes has transformed
              the beauty experience for countless clients.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Every detail matters — from precision shaping to artistic design.
              Dr. Chandni believes that nails are not just a style, but a reflection
              of personality, confidence, and elegance.
            </p>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Award, label: "Expert Nail Extension Artist" },
                { icon: Star, label: "Bridal & Premium Nail Specialist" },
                { icon: Sparkles, label: "Long-Lasting & Hygienic Techniques" },
                { icon: Heart, label: "Client-Focused Luxury Experience" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Award, Heart, Sparkles, Star } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-deep/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Owner Profile Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] gold-border">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800"
                alt="Salon Owner - Master Nail Artist"
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
                      <p className="font-display text-lg font-semibold text-foreground">Isabella Chen</p>
                      <p className="text-sm text-gold">Founder & Master Artist</p>
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
              With over a decade of experience in luxury nail artistry, Isabella Chen founded 
              Nirvana Nails with a vision to create a sanctuary where beauty meets tranquility. 
              Her journey began in the vibrant streets of Paris, where she honed her craft under 
              world-renowned nail artists.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Today, Nirvana Nails stands as a testament to her dedication—a place where every 
              client is treated like royalty, and every nail is a canvas for artistic expression. 
              Her philosophy is simple: perfection lies in the details.
            </p>

            {/* Achievements */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Award, label: "Certified Master Technician" },
                { icon: Star, label: "Award-Winning Designs" },
                { icon: Sparkles, label: "Celebrity Clientele" },
                { icon: Heart, label: "Eco-Friendly Products" },
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

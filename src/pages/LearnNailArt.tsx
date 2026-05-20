import { Link } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";
import { CalendarDays, CheckCircle2, Clock3, Sparkles } from "lucide-react";

const courses = [
  {
    title: "Learn Gel Polish with Basic Arts",
    price: "₹999",
    duration: "3 days • 1 hour per day",
    intro:
      "Learn gel polish with basic arts in just three days. Designed for beginners who want a fast, practical start.",
    highlights: [
      "Gel polish basics",
      "Basic art practice",
      "Simple salon-ready finishes",
      "Book your slot now!",
    ],
  },
  {
    title: "Basic Nail Art Course",
    price: "₹2500",
    duration: "5 days • 1 hour per day",
    intro:
      "A deeper learning course covering nail prep, gel application and a full set of popular art styles.",
    highlights: [
      "Nail anatomy",
      "Nail preparation / dry manicure",
      "How to apply gel polish",
      "How to remove gel polish",
      "French art, ombre art, glitter art",
      "Polka dots, striped / line art, floral art",
      "Sticker art, marble art, chrome art",
      "Bow art, heart nail art, swirl art, cat eye polish",
    ],
  },
];

const LearnNailArt = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo
        title={`Learn Nail Art – ${SALON_NAME}`}
        description="Learn gel polish and nail art with guided beginner-friendly courses in Rajkot."
        path="/learn-nail-art"
      />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-10 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-8 w-72 h-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-purple-deep/15 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass gold-border mb-5">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em]">
              Learning programs
            </span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Learn <span className="text-gradient">nail art</span> with practical courses
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Two focused beginner courses with short daily classes, hands-on practice and salon-style
            finishing techniques.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.title}
              className="rounded-3xl border border-border/50 bg-card/70 p-6 sm:p-7 shadow-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold mb-2">Course</p>
                  <h2 className="font-display text-2xl font-semibold leading-tight">{course.title}</h2>
                </div>
                <div className="rounded-2xl bg-gold/10 border border-gold/20 px-4 py-3 text-right">
                  <p className="text-xs text-muted-foreground">Only</p>
                  <p className="text-xl font-bold text-gold">{course.price}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5">
                  <Clock3 className="w-4 h-4 text-gold" />
                  {course.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3 py-1.5">
                  <CalendarDays className="w-4 h-4 text-gold" />
                  Beginner friendly
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-5">{course.intro}</p>

              <div className="space-y-2 mb-6">
                {course.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/60 p-4 text-sm text-muted-foreground">
                Learn in short daily sessions, practice on real nail-art patterns, and build a strong
                foundation for salon work.
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="gold" asChild>
                  <Link to="/appointment">Book your slot now</Link>
                </Button>
                <Button variant="glass" asChild>
                  <Link to="/contact">Ask about the course</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-3xl border border-gold/20 bg-gold/5 p-6 sm:p-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2">Ready to start learning?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Book a slot for the learning course or contact us for the next batch schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="gold" asChild>
                <Link to="/appointment">Book appointment</Link>
              </Button>
              <Button variant="outline" className="border-gold/40" asChild>
                <Link to="/services">View salon treatments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default LearnNailArt;
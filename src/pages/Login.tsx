import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";
import { useAuth } from "@/contexts/AuthContext";
import { isFirebaseConfigured } from "@/firebase";
import { User, Mail } from "lucide-react";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!isFirebaseConfigured) {
      setErrorMsg("Firebase is not configured on this site yet.");
      setLoading(false);
      return;
    }

    try {
      const user = await login(name, email);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not sign in. Try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo
        title={`Sign in – ${SALON_NAME}`}
        description="Enter your name and email — no password needed."
        path="/login"
        noIndex
      />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 container mx-auto px-4 max-w-md">
        <h1 className="font-display text-3xl font-bold mb-2 text-center">Welcome back</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Just your name and email — no password to remember.
        </p>

        {errorMsg && (
          <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-md text-center">
            {errorMsg}
          </p>
        )}

        {!isFirebaseConfigured && (
          <p className="text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 p-3 rounded-md mb-4">
            Add <code className="text-gold">VITE_FIREBASE_*</code> in Vercel and redeploy.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border/50 bg-card/40 p-6"
        >
          <FormField label="Your name" icon={<User className="w-4 h-4 text-gold" />}>
            <input
              className={inputClass}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Shah"
              autoComplete="name"
            />
          </FormField>
          <FormField label="Email" icon={<Mail className="w-4 h-4 text-gold" />}>
            <input
              className={inputClass}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </FormField>
          <Button
            type="submit"
            className="w-full"
            variant="gold"
            disabled={loading || !isFirebaseConfigured}
          >
            {loading ? "Signing in…" : "Continue"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          <Link to="/" className="text-gold hover:underline">
            ← Back to home
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
};

function FormField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

export default Login;

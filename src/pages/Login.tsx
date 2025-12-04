import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMsg("Login Successful 🎉 Redirecting...");
      setTimeout(() => {
        window.location.href = "/admin"; // redirect after login
      }, 1200);
    } catch (error: any) {
      setErrorMsg("Wrong email or password ❌");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="pt-32 pb-10 container mx-auto px-4 max-w-md">
        <h1 className="font-display text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        {errorMsg && (
          <p className="mb-3 text-sm text-red-500 bg-red-500/10 p-2 rounded-md text-center">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="mb-3 text-sm text-green-500 bg-green-500/10 p-2 rounded-md text-center">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-md border bg-card focus:ring-2 focus:ring-gold outline-none"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                className="w-full mt-1 px-3 py-2 rounded-md border bg-card focus:ring-2 focus:ring-gold outline-none"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-muted-foreground"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="gold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center mt-5 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-gold font-medium hover:underline"
          >
            Register now
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
};

export default Login;

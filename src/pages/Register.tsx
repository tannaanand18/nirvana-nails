// src/pages/Register.tsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/Footer";
import { Button } from "../components/ui/button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // write user doc with default role = "user"
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      setSuccessMsg("Account created 🎉 You can now login");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message || "This account already exists ❌");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-10 container mx-auto px-4 max-w-md">
        <h1 className="font-display text-3xl font-bold mb-6 text-center">Register</h1>

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

        <form onSubmit={handleRegister} className="space-y-4">
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
            <input
              className="w-full mt-1 px-3 py-2 rounded-md border bg-card focus:ring-2 focus:ring-gold outline-none"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>

          <Button type="submit" className="w-full" variant="gold">
            Create Account
          </Button>
        </form>

        <p className="text-center mt-5 text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-gold font-medium hover:underline">
            Login
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
};

export default Register;

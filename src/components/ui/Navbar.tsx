// src/components/ui/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { checkAdmin } from "../../utils/checkAdmin";
import { signOut } from "firebase/auth";
import { Button } from "./button";

export const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoadingAdmin(false);
        return;
      }
      setLoadingAdmin(true);
      const res = await checkAdmin(user.uid);
      setIsAdmin(res);
      setLoadingAdmin(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-background/60 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-bold text-lg text-foreground">Nirvana Nails</span>
          <span className="text-[11px] text-muted-foreground tracking-wide">Nail Art • Extensions • Glam</span>
        </Link>

        <nav className="hidden md:flex gap-8 font-medium text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-gold" : "hover:text-gold transition")}>Home</NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? "text-gold" : "hover:text-gold transition")}>Services</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? "text-gold" : "hover:text-gold transition")}>Gallery</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "text-gold" : "hover:text-gold transition")}>Contact</NavLink>
          {/* show admin link only for admin */}
          {!loadingAdmin && isAdmin && <NavLink to="/admin" className={({ isActive }) => (isActive ? "text-gold" : "hover:text-gold transition")}>Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/appointment">
            <Button variant="gold" size="sm">Book Now</Button>
          </Link>

          {/* Show login or logout depending on auth */}
          {auth.currentUser ? (
            <button onClick={handleLogout} className="hidden md:block text-sm hover:text-gold transition">Logout</button>
          ) : (
            <Link to="/login" className="hidden md:block text-sm hover:text-gold transition">Login</Link>
          )}

          {/* Mobile menu button can be re-added if you use it */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const WHATSAPP_NUMBER = "919512267420"; 

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/#contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi Nirvana Nails 💅, I’d like to book an appointment."
  )}`;

  const closeMenu = () => setOpen(false);

  // 🔐 Detect login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // 🚪 Logout function
  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold to-purple-deep flex items-center justify-center text-xs font-bold text-background">
            NN
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold">
              Nirvana Nails
            </span>
            <span className="text-[11px] text-muted-foreground">
              Nail Art • Extensions • Glam
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => {
              const isHashLink = link.to.includes("#");
              const commonClasses =
                "relative px-1 py-0.5 text-sm transition-colors hover:text-gold";

              if (isHashLink) {
                return (
                  <li key={link.to}>
                    <a href={link.to} className={commonClasses}>
                      {link.label}
                    </a>
                  </li>
                );
              }

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `${commonClasses} ${
                        isActive ? "text-gold font-medium" : "text-muted-foreground"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Booking button */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="gold" size="sm" className="inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Book Now</span>
            </Button>
          </a>

          {/* 🔥 AUTH BUTTONS */}
          {!user && (
            <>
              <a href="/login" className="text-sm text-muted-foreground hover:text-gold">
                Login
              </a>
              <a href="/register" className="text-sm text-muted-foreground hover:text-gold">
                Register
              </a>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-border/60 bg-background/80"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <ul className="flex flex-col gap-2 text-sm">
              {navLinks.map((link) => {
                const isHashLink = link.to.includes("#");

                if (isHashLink) {
                  return (
                    <li key={link.to}>
                      <a
                        href={link.to}
                        onClick={closeMenu}
                        className="block py-1 text-muted-foreground hover:text-gold"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block py-1 ${
                          isActive ? "text-gold font-medium" : "text-muted-foreground"
                        } hover:text-gold`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              <Button
                variant="gold"
                size="sm"
                className="w-full inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book on WhatsApp</span>
              </Button>
            </a>

            {/* 🔥 AUTH for MOBILE */}
            {!user && (
              <>
                <a
                  href="/login"
                  onClick={closeMenu}
                  className="block py-2 text-muted-foreground hover:text-gold"
                >
                  Login
                </a>
                <a
                  href="/register"
                  onClick={closeMenu}
                  className="block py-2 text-muted-foreground hover:text-gold"
                >
                  Register
                </a>
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="block py-2 text-red-500 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./button";
import { Menu, X } from "lucide-react";
import { isFirebaseConfigured } from "@/firebase";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "text-gold" : "text-foreground/90 hover:text-gold transition";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToHash = (hash: string) => {
    const id = hash.replace("#", "");
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: id });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLinks = (
    <>
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/services" className={navLinkClass}>
        Treatments
      </NavLink>
      <NavLink to="/gallery" className={navLinkClass}>
        Gallery
      </NavLink>
      <NavLink to="/contact" className={navLinkClass}>
        Contact
      </NavLink>
      <button
        type="button"
        onClick={() => scrollToHash("#about")}
        className="text-left text-foreground/90 hover:text-gold transition"
      >
        About
      </button>
      {user && (
        <NavLink to="/dashboard" className={navLinkClass}>
          My salon
        </NavLink>
      )}
      {isAdmin && (
        <NavLink to="/admin" className={navLinkClass}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <header
      className={`fixed left-0 w-full bg-background/70 backdrop-blur-md border-b border-border z-50 ${
        isFirebaseConfigured ? "top-0" : "top-12 sm:top-14"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <Link to="/" className="flex flex-col leading-tight shrink-0 min-w-0">
          <span className="font-bold text-lg text-foreground truncate">Nirvana Nails</span>
          <span className="text-[11px] text-muted-foreground tracking-wide truncate max-w-[11rem] sm:max-w-none">
            Nail Art • Extensions • Glam
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-sm">{navLinks}</nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/appointment">
            <Button variant="gold" size="sm">
              Book
            </Button>
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden lg:inline text-sm hover:text-gold transition px-1"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hidden lg:inline text-sm hover:text-gold transition px-1">
              Sign in
            </Link>
          )}

          <button
            type="button"
            className="lg:hidden p-2 rounded-md border border-border/60"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1 text-base font-medium">
            <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/services" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Treatments
            </NavLink>
            <NavLink to="/gallery" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Gallery
            </NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Contact
            </NavLink>
            <button
              type="button"
              className="text-left py-2 text-foreground/90 hover:text-gold"
              onClick={() => {
                setMobileOpen(false);
                scrollToHash("#about");
              }}
            >
              About
            </button>
            {user && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                My salon
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Admin
              </NavLink>
            )}
            <hr className="border-border my-2" />
            {user ? (
              <button type="button" className="text-left py-2 text-sm text-muted-foreground" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <NavLink to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Sign in
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

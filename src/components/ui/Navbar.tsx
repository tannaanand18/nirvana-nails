import { Link, NavLink } from "react-router-dom";
import { Button } from "./button";

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-background/60 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Brand */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-bold text-lg text-foreground">Nirvana Nails</span>
          <span className="text-[11px] text-muted-foreground tracking-wide">
            Nail Art • Extensions • Glam
          </span>
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex gap-8 font-medium text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-gold" : "hover:text-gold transition"}>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? "text-gold" : "hover:text-gold transition"}>
            Services
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? "text-gold" : "hover:text-gold transition"}>
            Gallery
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "text-gold" : "hover:text-gold transition"}>
            Contact
          </NavLink>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/appointment">
            <Button variant="gold" size="sm">Book Now</Button>
          </Link>
          <Link to="/login" className="hidden md:block text-sm hover:text-gold transition">
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
};

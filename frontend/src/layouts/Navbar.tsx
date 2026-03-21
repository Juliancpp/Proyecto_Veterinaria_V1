import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Heart, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/about", label: "Nosotros" },
  { to: "/adopt", label: "Adoptar" },
  { to: "/clinics", label: "Clínicas" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="section-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary" fill="hsl(var(--primary))" />
          <span className="font-display text-xl font-bold text-foreground">PatitasHome</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="ml-2 flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          ) : (
            <Link to="/login" className="btn-hero ml-2 !px-6 !py-2 !text-sm">
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <div className="section-container flex flex-col gap-2 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button onClick={() => { logout(); setOpen(false); }} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Cerrar sesión
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-hero mt-2 text-center !text-sm">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-border bg-muted/50">
    <div className="section-container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="hsl(var(--primary))" />
            <span className="font-display text-lg font-bold">PatitasHome</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Conectando corazones con hogares. Cada mascota merece una segunda oportunidad.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Navegación</h4>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Inicio</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Nosotros</Link>
            <Link to="/adopt" className="text-sm text-muted-foreground hover:text-primary transition-colors">Adoptar</Link>
            <Link to="/clinics" className="text-sm text-muted-foreground hover:text-primary transition-colors">Clínicas</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Contacto</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <p>📧 info@patitashome.org</p>
            <p>📞 +57 300 123 4567</p>
            <p>📍 Bogotá, Colombia</p>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PatitasHome. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

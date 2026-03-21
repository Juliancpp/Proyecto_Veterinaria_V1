import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { Mail, Lock, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      const user = useAuthStore.getState().user;
      if (!user?.onboarding_complete) navigate("/onboarding");
      else if (user.role === "admin") navigate("/admin");
      else if (user.role === "staff") navigate("/staff/pets");
      else navigate("/app/pets");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-pet p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Heart className="h-8 w-8 text-primary" fill="hsl(var(--primary))" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Bienvenido de vuelta</h1>
            <p className="mt-1 text-sm text-muted-foreground">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-hero w-full justify-center !py-3 !text-base disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, PawPrint, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { adoptionService, type LikedPetEntry } from "@/services/adoptionService";

const statusConfig: Record<string, { label: string; variant: "outline" | "default" | "destructive" }> = {
  pending: { label: "Pendiente", variant: "outline" },
  approved: { label: "Aprobado", variant: "default" },
  rejected: { label: "Rechazado", variant: "destructive" },
};

const LikesPage = () => {
  const [likes, setLikes] = useState<LikedPetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adoptionService.getLikedPets()
      .then(setLikes)
      .catch(() => setLikes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const handleApply = async (petId: number) => {
    setApplying(petId);
    setError(null);
    try {
      await adoptionService.createAdoptionRequest(petId);
      // Update local state
      setLikes((prev) =>
        prev.map((l) =>
          l.pet.id === petId ? { ...l, adoption_status: "pending" } : l
        )
      );
      setSuccess("Solicitud de adopción enviada.");
    } catch (err: any) {
      const msg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || "Error al enviar la solicitud.";
      setError(msg);
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="section-container py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Mis <span className="gradient-text">Favoritos</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mascotas que te han enamorado
        </p>
      </div>

      {success && (
        <div className="mx-auto mt-4 max-w-md rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          {success}
        </div>
      )}
      {error && (
        <div className="mx-auto mt-4 max-w-md rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {likes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 flex flex-col items-center text-center"
        >
          <PawPrint className="h-16 w-16 text-muted-foreground/30" />
          <p className="mt-4 font-display text-xl font-semibold text-foreground">
            Aún no tienes favoritos
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Visita la sección de adopción y dale like a las mascotas que te gusten.
          </p>
        </motion.div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {likes.map((entry, i) => {
            const pet = entry.pet;
            const adoptStatus = entry.adoption_status;
            const cfg = adoptStatus ? statusConfig[adoptStatus] : null;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-pet overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <PawPrint className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute right-2 top-2">
                    <Heart className="h-6 w-6 text-red-500" fill="rgb(239 68 68)" />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {pet.name}
                    </h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {pet.age}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {pet.breed}
                    {pet.status && (
                      <span className="ml-2 capitalize">
                        · {pet.status === "available" ? "Disponible" : "Adoptado"}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {pet.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    {cfg ? (
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin solicitud</span>
                    )}

                    {!adoptStatus && pet.status === "available" && (
                      <Button
                        size="sm"
                        onClick={() => handleApply(pet.id)}
                        disabled={applying === pet.id}
                      >
                        {applying === pet.id ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Send className="mr-1 h-3 w-3" />
                        )}
                        Solicitar
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LikesPage;

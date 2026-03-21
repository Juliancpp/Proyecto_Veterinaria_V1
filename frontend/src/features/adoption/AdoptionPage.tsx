import { useState, type TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, PawPrint } from "lucide-react";
import { usePets } from "@/hooks/usePets";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const AdoptionPage = () => {
  const { currentPet, hasMore, likedPets, loading, handleLike, handlePass } = usePets();
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const onSwipe = (dir: "left" | "right") => {
    setDirection(dir);
    setTimeout(() => {
      if (dir === "right") handleLike();
      else handlePass();
      setDirection(null);
    }, 300);
  };

  const handleTouchStart = (e: TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 80) onSwipe(diff > 0 ? "right" : "left");
    setTouchStart(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="section-container py-12">
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Encuentra tu <span className="gradient-text">compañero</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Desliza a la derecha si te enamoras 💛
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-sm flex-col items-center">
        <div className="relative h-[480px] w-full">
          <AnimatePresence mode="wait">
            {hasMore && currentPet ? (
              <motion.div
                key={currentPet.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
                  rotate: direction === "left" ? -15 : direction === "right" ? 15 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 card-pet cursor-grab overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="h-[300px] overflow-hidden">
                  <img src={currentPet.image} alt={currentPet.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl font-bold text-foreground">{currentPet.name}</h2>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {currentPet.age}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{currentPet.breed}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{currentPet.description}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                <PawPrint className="h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 font-display text-xl font-semibold text-foreground">¡Has visto todos!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Te gustaron {likedPets.length} peludos 💛
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hasMore && currentPet && (
          <div className="mt-6 flex gap-6">
            <button
              onClick={() => onSwipe("left")}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive/30 text-destructive transition-all hover:bg-destructive/10 hover:scale-110"
            >
              <X className="h-7 w-7" />
            </button>
            <button
              onClick={() => onSwipe("right")}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-secondary/30 text-secondary transition-all hover:bg-secondary/10 hover:scale-110"
            >
              <Heart className="h-7 w-7" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionPage;

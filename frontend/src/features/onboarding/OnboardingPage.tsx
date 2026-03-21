import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dog, Cat, Rabbit, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";

const petTypes = [
  { id: "dogs", label: "Perros", icon: Dog },
  { id: "cats", label: "Gatos", icon: Cat },
  { id: "others", label: "Otros", icon: Rabbit },
];

const sizes = [
  { id: "small", label: "Pequeño" },
  { id: "medium", label: "Mediano" },
  { id: "large", label: "Grande" },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const navigate = useNavigate();
  const updateUser = useAuthStore((s) => s.updateUser);

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  const handleFinish = async () => {
    try {
      await api.post("/auth/onboarding/", { pet_types: selectedTypes, sizes: selectedSizes });
    } catch {
      // continue even if API fails
    }
    updateUser({ onboarding_complete: true });
    navigate("/app/pets");
  };

  const steps = [
    {
      title: "¿Qué tipo de mascota buscas?",
      subtitle: "Puedes elegir más de una",
      content: (
        <div className="grid grid-cols-3 gap-4">
          {petTypes.map((t) => {
            const Icon = t.icon;
            const active = selectedTypes.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleItem(selectedTypes, setSelectedTypes, t.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-6 transition-all ${
                  active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Icon className="h-10 w-10" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: "¿Qué tamaño prefieres?",
      subtitle: "Selecciona todos los que te interesen",
      content: (
        <div className="flex flex-wrap justify-center gap-3">
          {sizes.map((s) => {
            const active = selectedSizes.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleItem(selectedSizes, setSelectedSizes, s.id)}
                className={`rounded-full border-2 px-8 py-3 text-sm font-medium transition-all ${
                  active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* Progress */}
        <div className="mb-8 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-12 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground">{steps[step].title}</h1>
            <p className="mt-2 text-muted-foreground">{steps[step].subtitle}</p>
            <div className="mt-8">{steps[step].content}</div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex justify-center gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Atrás
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>
              Siguiente <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish}>
              ¡Empezar! 🐾
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

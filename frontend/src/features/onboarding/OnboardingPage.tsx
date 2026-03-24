import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";

/* ───────────────────── 15 Multiple-choice questions ───────────────────── */

interface MCQuestion {
  key: string;
  question: string;
  options: { value: string; label: string }[];
}

const mcQuestions: MCQuestion[] = [
  {
    key: "q1_tiempo_juego",
    question:
      "1. ¿Cuánto tiempo al día, en promedio, planea dedicar exclusivamente a jugar o pasear a la mascota?",
    options: [
      { value: "a", label: "a) Menos de 30 minutos." },
      { value: "b", label: "b) Entre 30 minutos y 1 hora." },
      { value: "c", label: "c) Más de 2 horas." },
      { value: "d", label: "d) Solo los fines de semana." },
    ],
  },
  {
    key: "q2_accidente_casa",
    question:
      "2. Si la mascota orina o defeca dentro de la casa durante su periodo de adaptación, ¿cómo reaccionaría usted?",
    options: [
      { value: "a", label: "a) Le daría un correctivo físico (golpe o palmada)." },
      { value: "b", label: "b) Lo sacaría al patio o balcón permanentemente." },
      { value: "c", label: "c) Limpiaría y buscaría métodos de refuerzo positivo o paciencia." },
      { value: "d", label: "d) Lo devolvería al refugio de inmediato." },
    ],
  },
  {
    key: "q3_cerramiento",
    question:
      "3. ¿Qué tipo de cerramiento o seguridad tiene su vivienda para evitar que el animal se escape a la calle?",
    options: [
      { value: "a", label: "a) Muros altos y portones cerrados." },
      { value: "b", label: "b) Ventanas con malla de seguridad (necesario para gatos)." },
      { value: "c", label: "c) No tiene cerramiento, pero lo mantendré amarrado." },
      { value: "d", label: "d) No tiene cerramiento, confío en que no se vaya." },
    ],
  },
  {
    key: "q4_alimentacion",
    question: "4. ¿Cuál es su postura sobre la alimentación de la mascota?",
    options: [
      { value: "a", label: "a) Le daré sobras de comida casera." },
      { value: "b", label: "b) Compraré el alimento más económico disponible." },
      { value: "c", label: "c) Compraré alimento balanceado de calidad media o alta." },
      { value: "d", label: "d) Lo que esté en oferta en el momento." },
    ],
  },
  {
    key: "q5_seguimiento",
    question:
      "5. ¿Está de acuerdo con recibir visitas de seguimiento o enviar fotos periódicas para ver el estado del animal?",
    options: [
      { value: "a", label: "a) Sí, totalmente de acuerdo." },
      { value: "b", label: "b) Solo durante el primer mes." },
      { value: "c", label: "c) No, me parece una invasión a mi privacidad." },
      { value: "d", label: "d) Solo si yo tengo tiempo de enviarlas." },
    ],
  },
  {
    key: "q6_experiencia",
    question:
      "6. ¿Qué experiencia previa tiene cuidando mascotas de forma responsable?",
    options: [
      { value: "a", label: "a) Es mi primera mascota." },
      { value: "b", label: "b) He tenido mascotas, pero no era el responsable principal." },
      { value: "c", label: "c) He tenido mascotas antes y cumplí con todo su ciclo de vida." },
      { value: "d", label: "d) He tenido mascotas, pero las regalé o se escaparon." },
    ],
  },
  {
    key: "q7_tiempo_sola",
    question:
      "7. ¿Cuánto tiempo planea que la mascota pase sola en casa diariamente?",
    options: [
      { value: "a", label: "a) Menos de 4 horas." },
      { value: "b", label: "b) Entre 4 y 8 horas." },
      { value: "c", label: "c) Más de 9 horas." },
      { value: "d", label: "d) Casi todo el día, pero alguien pasará a verle." },
    ],
  },
  {
    key: "q8_presupuesto",
    question:
      "8. ¿Cuál es el presupuesto mensual estimado que tiene reservado para la mascota (comida, higiene, salud)?",
    options: [
      { value: "a", label: "a) Menos de lo básico." },
      { value: "b", label: "b) Solo lo justo para la comida." },
      { value: "c", label: "c) Un presupuesto estable que cubre comida de calidad y salud." },
      { value: "d", label: "d) No he pensado en un presupuesto fijo." },
    ],
  },
  {
    key: "q9_comportamiento",
    question:
      "9. Si el animal presenta un problema de comportamiento (ladridos, maullidos, rompe objetos), ¿qué medida tomaría?",
    options: [
      { value: "a", label: "a) Lo regañaría físicamente para que aprenda." },
      { value: "b", label: "b) Lo dejaría en el patio o terraza como castigo." },
      { value: "c", label: "c) Consultaría con un profesional o educador y tendría paciencia." },
      { value: "d", label: "d) Lo devolvería porque no puedo lidiar con eso." },
    ],
  },
  {
    key: "q10_lugar",
    question: "10. ¿Dónde pasará la mayor parte del tiempo la mascota?",
    options: [
      { value: "a", label: "a) Dentro de la casa, integrado con la familia." },
      { value: "b", label: "b) En el patio o jardín durante el día y dentro de noche." },
      { value: "c", label: "c) Siempre en el patio, terraza o garaje." },
      { value: "d", label: "d) Amarrado o en una jaula por seguridad." },
    ],
  },
  {
    key: "q11_vacaciones",
    question:
      "11. En caso de que deba salir de vacaciones, ¿qué pasará con el animal?",
    options: [
      { value: "a", label: "a) Se queda solo con comida suficiente para varios días." },
      { value: "b", label: "b) Se queda al cuidado de un familiar o en una guardería de confianza." },
      { value: "c", label: "c) Lo dejaré afuera de la casa para que alguien le eche comida." },
      { value: "d", label: "d) No tengo un plan definido todavía." },
    ],
  },
  {
    key: "q12_esterilizacion",
    question: "12. ¿Qué opina sobre la esterilización de las mascotas?",
    options: [
      { value: "a", label: "a) Es fundamental para evitar el abandono y por salud." },
      { value: "b", label: "b) Solo si el animal me da problemas de conducta." },
      { value: "c", label: "c) No estoy de acuerdo, quiero que tenga crías al menos una vez." },
      { value: "d", label: "d) Me es indiferente." },
    ],
  },
  {
    key: "q13_actividad_fisica",
    question:
      "13. ¿Cuál es el nivel de actividad física de los miembros del hogar?",
    options: [
      { value: "a", label: "a) Muy activo (hacemos ejercicio o caminatas diarias)." },
      { value: "b", label: "b) Moderado (salimos a caminar de vez en cuando)." },
      { value: "c", label: "c) Sedentario (preferimos estar en casa tranquilos)." },
      { value: "d", label: "d) No tenemos tiempo para actividad física." },
    ],
  },
  {
    key: "q14_familia_acuerdo",
    question:
      "14. ¿Todos los miembros de la familia están de acuerdo con la llegada de este nuevo integrante?",
    options: [
      { value: "a", label: "a) Sí, todos están emocionados y de acuerdo." },
      { value: "b", label: "b) Algunos no están convencidos, pero aceptaron." },
      { value: "c", label: "c) Es una sorpresa para alguien, no lo saben." },
      { value: "d", label: "d) No vivo con nadie, la decisión es solo mía." },
    ],
  },
  {
    key: "q15_alergia",
    question:
      "15. ¿Qué sucedería con la mascota si usted o alguien en su hogar desarrolla una alergia repentina?",
    options: [
      { value: "a", label: "a) Buscaría tratamiento médico y soluciones de limpieza antes de considerar darlo en adopción." },
      { value: "b", label: "b) Lo sacaría al patio o jardín permanentemente para no tener contacto." },
      { value: "c", label: "c) Lo devolvería al refugio o lo regalaría de inmediato." },
      { value: "d", label: "d) No sé qué haría en ese caso." },
    ],
  },
];

/* ───────────────────── 5 Open-ended questions ───────────────────── */

interface OpenQuestion {
  key: string;
  question: string;
  placeholder: string;
}

const openQuestions: OpenQuestion[] = [
  {
    key: "q16_cirugia_emergencia",
    question:
      "16. ¿Qué plan tiene si el animal requiere una cirugía de emergencia o un tratamiento médico costoso inesperado?",
    placeholder: "Describa su plan financiero o de acción...",
  },
  {
    key: "q17_mudanza",
    question:
      "17. En caso de una mudanza a un lugar donde no acepten mascotas, ¿cuál sería su plan de acción?",
    placeholder: "Explique qué haría en esa situación...",
  },
  {
    key: "q18_responsable",
    question:
      "18. ¿Quién será el responsable principal de la limpieza, alimentación y paseos de la mascota en el hogar?",
    placeholder: "Indique quién y cómo se organizarían...",
  },
  {
    key: "q19_bebe_pareja",
    question:
      "19. ¿Qué pasaría con la mascota si en el futuro llega un bebé a la familia o cambia su situación de pareja?",
    placeholder: "Describa cómo manejaría esa situación...",
  },
  {
    key: "q20_devolver",
    question:
      "20. ¿Bajo qué circunstancias consideraría devolver a la mascota?",
    placeholder: "Explique en qué caso extremo lo consideraría...",
  },
];

/* ───────────────── Page-chunking: 5 MC questions per page ────────────── */

const MC_PER_PAGE = 5;
const mcPages = Array.from(
  { length: Math.ceil(mcQuestions.length / MC_PER_PAGE) },
  (_, i) => mcQuestions.slice(i * MC_PER_PAGE, (i + 1) * MC_PER_PAGE)
);

// Total steps: mcPages.length (3) + 1 open-ended page = 4
const TOTAL_STEPS = mcPages.length + 1;

/* ═══════════════════════════ Component ═══════════════════════════════ */

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const updateUser = useAuthStore((s) => s.updateUser);

  const setAnswer = (key: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  /* ── Validation per step ── */
  const canProceed = (): boolean => {
    if (step < mcPages.length) {
      // All MC questions on this page must be answered
      return mcPages[step].every((q) => !!answers[q.key]);
    }
    // Open-ended: all must have >= 10 chars
    return openQuestions.every((q) => (answers[q.key] ?? "").trim().length >= 10);
  };

  /* ── Submit ── */
  const handleFinish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/auth/onboarding/", {
        preferences: {},
        answers,
        completed: true,
      });
      updateUser({ onboarding_complete: true });
      navigate("/app/pets");
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Step content builders ── */
  const buildMCPage = (pageIdx: number) => {
    const questions = mcPages[pageIdx];
    const from = pageIdx * MC_PER_PAGE + 1;
    const to = from + questions.length - 1;
    return {
      title: `Preguntas ${from}–${to} de 15`,
      subtitle: "Seleccione una opción para cada pregunta",
      content: (
        <div className="space-y-6 text-left">
          {questions.map((q) => (
            <div key={q.key}>
              <p className="mb-3 text-sm font-semibold leading-snug text-foreground">
                {q.question}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt) => {
                  const active = answers[q.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswer(q.key, opt.value)}
                      className={`w-full rounded-lg border-2 px-4 py-2.5 text-left text-sm transition-all ${
                        active
                          ? "border-primary bg-primary/10 font-medium text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ),
    };
  };

  const openEndedStep = {
    title: "Preguntas abiertas (16–20)",
    subtitle: "Responda con sus propias palabras (mínimo 10 caracteres cada una)",
    content: (
      <div className="space-y-6 text-left">
        {openQuestions.map((q) => (
          <div key={q.key}>
            <p className="mb-2 text-sm font-semibold leading-snug text-foreground">
              {q.question}
            </p>
            <Textarea
              placeholder={q.placeholder}
              value={answers[q.key] ?? ""}
              onChange={(e) => setAnswer(q.key, e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {(answers[q.key] ?? "").length} / 10 caracteres mínimo
            </p>
          </div>
        ))}
      </div>
    ),
  };

  /* Build the active step */
  const currentStep =
    step < mcPages.length ? buildMCPage(step) : openEndedStep;

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8 flex justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
              style={{ width: `${100 / TOTAL_STEPS}%`, maxWidth: 64 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {currentStep.title}
              </h1>
              <p className="mt-2 text-muted-foreground">{currentStep.subtitle}</p>
            </div>

            <div className="mt-8 max-h-[55vh] overflow-y-auto rounded-xl border border-border/50 bg-background p-6">
              {currentStep.content}
            </div>
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}

        {/* Navigation */}
        <div className="mt-8 flex justify-center gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Atrás
            </Button>
          )}
          {!isLastStep ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Siguiente <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={!canProceed() || submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Guardando..." : "Enviar cuestionario"}
            </Button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Paso {step + 1} de {TOTAL_STEPS}
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;

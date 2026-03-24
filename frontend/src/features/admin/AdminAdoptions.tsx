import { useState, useEffect, Fragment } from "react";
import { CheckCircle, XCircle, Clock, Loader2, Eye, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adoptionService, type AdoptionRequest } from "@/services/adoptionService";
import { onboardingService, type OnboardingData } from "@/services/onboardingService";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, variant: "outline" as const },
  approved: { label: "Aprobado", icon: CheckCircle, variant: "default" as const },
  rejected: { label: "Rechazado", icon: XCircle, variant: "destructive" as const },
};

/* ─── Question titles & option labels matching the exact questionnaire ─── */

const questionTitles: Record<string, string> = {
  q1_tiempo_juego: "1. Tiempo dedicado a jugar / pasear",
  q2_accidente_casa: "2. Reacción si orina/defeca en casa",
  q3_cerramiento: "3. Cerramiento / seguridad vivienda",
  q4_alimentacion: "4. Postura sobre alimentación",
  q5_seguimiento: "5. Visitas de seguimiento",
  q6_experiencia: "6. Experiencia previa con mascotas",
  q7_tiempo_sola: "7. Tiempo sola en casa",
  q8_presupuesto: "8. Presupuesto mensual",
  q9_comportamiento: "9. Problemas de comportamiento",
  q10_lugar: "10. Dónde pasará el tiempo",
  q11_vacaciones: "11. Plan para vacaciones",
  q12_esterilizacion: "12. Opinión sobre esterilización",
  q13_actividad_fisica: "13. Actividad física del hogar",
  q14_familia_acuerdo: "14. Familia de acuerdo",
  q15_alergia: "15. Plan ante alergia repentina",
  q16_cirugia_emergencia: "16. Plan ante cirugía de emergencia",
  q17_mudanza: "17. Plan ante mudanza",
  q18_responsable: "18. Responsable principal del cuidado",
  q19_bebe_pareja: "19. Llegada de bebé / cambio de pareja",
  q20_devolver: "20. Circunstancias para devolver",
};

const mcOptionLabels: Record<string, Record<string, string>> = {
  q1_tiempo_juego: {
    a: "Menos de 30 min",
    b: "30 min – 1 hora",
    c: "Más de 2 horas",
    d: "Solo fines de semana",
  },
  q2_accidente_casa: {
    a: "Correctivo físico",
    b: "Sacarlo al patio permanente",
    c: "Refuerzo positivo / paciencia",
    d: "Devolver al refugio",
  },
  q3_cerramiento: {
    a: "Muros altos / portones",
    b: "Malla de seguridad",
    c: "Sin cerramiento, amarrado",
    d: "Sin cerramiento, confía",
  },
  q4_alimentacion: {
    a: "Sobras de comida casera",
    b: "Alimento más económico",
    c: "Alimento balanceado calidad media/alta",
    d: "Lo que esté en oferta",
  },
  q5_seguimiento: {
    a: "Sí, totalmente de acuerdo",
    b: "Solo el primer mes",
    c: "No, invasión a privacidad",
    d: "Solo si tengo tiempo",
  },
  q6_experiencia: {
    a: "Primera mascota",
    b: "He tenido, no responsable principal",
    c: "He tenido, cumplí todo su ciclo",
    d: "He tenido, las regalé/escaparon",
  },
  q7_tiempo_sola: {
    a: "Menos de 4 horas",
    b: "Entre 4 y 8 horas",
    c: "Más de 9 horas",
    d: "Casi todo el día, alguien pasa",
  },
  q8_presupuesto: {
    a: "Menos de lo básico",
    b: "Solo lo justo para comida",
    c: "Presupuesto estable (comida + salud)",
    d: "No he pensado en presupuesto",
  },
  q9_comportamiento: {
    a: "Regañar físicamente",
    b: "Patio/terraza como castigo",
    c: "Consultar profesional, paciencia",
    d: "Devolverlo",
  },
  q10_lugar: {
    a: "Dentro de casa, con familia",
    b: "Patio de día, dentro de noche",
    c: "Siempre en patio/terraza/garaje",
    d: "Amarrado o en jaula",
  },
  q11_vacaciones: {
    a: "Solo con comida varios días",
    b: "Familiar o guardería de confianza",
    c: "Afuera, alguien le echa comida",
    d: "Sin plan definido",
  },
  q12_esterilizacion: {
    a: "Fundamental (evitar abandono + salud)",
    b: "Solo si da problemas de conducta",
    c: "No, quiero que tenga crías",
    d: "Indiferente",
  },
  q13_actividad_fisica: {
    a: "Muy activo (ejercicio diario)",
    b: "Moderado",
    c: "Sedentario",
    d: "Sin tiempo para actividad",
  },
  q14_familia_acuerdo: {
    a: "Todos de acuerdo y emocionados",
    b: "Algunos no convencidos",
    c: "Es una sorpresa",
    d: "Vivo solo, decisión propia",
  },
  q15_alergia: {
    a: "Tratamiento médico primero",
    b: "Patio permanente",
    c: "Devolver/regalar inmediato",
    d: "No sé qué haría",
  },
};

const MC_KEYS = Object.keys(mcOptionLabels);
const OPEN_KEYS = ["q16_cirugia_emergencia", "q17_mudanza", "q18_responsable", "q19_bebe_pareja", "q20_devolver"];

/* ─── Score helpers ─── */

function scoreLabel(score: number): { text: string; color: string } {
  if (score >= 40) return { text: "Excelente", color: "text-green-600" };
  if (score >= 30) return { text: "Bueno", color: "text-blue-600" };
  if (score >= 20) return { text: "Regular", color: "text-yellow-600" };
  return { text: "Riesgoso", color: "text-red-600" };
}

/* Identify "risky" MC answers (scored 0 in backend) */
const riskyAnswers: Record<string, string[]> = {
  q1_tiempo_juego: ["a"],
  q2_accidente_casa: ["a", "b", "d"],
  q3_cerramiento: ["d"],
  q4_alimentacion: ["a"],
  q5_seguimiento: ["c"],
  q6_experiencia: ["d"],
  q7_tiempo_sola: ["c"],
  q8_presupuesto: ["a", "d"],
  q9_comportamiento: ["a", "b", "d"],
  q10_lugar: ["d"],
  q11_vacaciones: ["a", "c"],
  q12_esterilizacion: ["c", "d"],
  q13_actividad_fisica: ["d"],
  q14_familia_acuerdo: ["c"],
  q15_alergia: ["c", "d"],
};

/* ═══════════════════════════ Component ═══════════════════════════════ */

const AdminAdoptions = () => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingCache, setOnboardingCache] = useState<Record<number, OnboardingData>>({});
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [loadingOnboarding, setLoadingOnboarding] = useState<number | null>(null);

  useEffect(() => {
    adoptionService.getAdoptionRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const updated = await adoptionService.updateAdoptionStatus(id, newStatus);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch {}
  };

  const toggleOnboarding = async (requestId: number, userId: number) => {
    if (expandedRow === requestId) {
      setExpandedRow(null);
      return;
    }
    setExpandedRow(requestId);
    if (!onboardingCache[userId]) {
      setLoadingOnboarding(userId);
      try {
        const data = await onboardingService.getByUser(userId);
        setOnboardingCache((prev) => ({ ...prev, [userId]: data }));
      } catch {}
      finally { setLoadingOnboarding(null); }
    }
  };

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Solicitudes de Adopción</h1>
      <p className="mt-1 text-muted-foreground">Revisa cuestionario y gestiona las solicitudes</p>

      <Card className="mt-6 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Sin solicitudes de adopción
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((r) => {
                  const cfg = statusConfig[r.status];
                  const isExpanded = expandedRow === r.id;
                  const userId = r.user_data?.id ?? r.user;
                  const ob = onboardingCache[userId];
                  const sc = ob ? scoreLabel(ob.score) : null;

                  return (
                    <Fragment key={r.id}>
                      <TableRow>
                        <TableCell className="font-medium">{r.user_data?.name || "—"}</TableCell>
                        <TableCell className="text-sm">{r.user_data?.email || "—"}</TableCell>
                        <TableCell>{r.pet_data?.name || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleOnboarding(r.id, userId)}>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <><Eye className="mr-1 h-4 w-4" />Ver perfil</>}
                          </Button>
                          {r.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "approved")}>
                                Aprobar
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, "rejected")}>
                                Rechazar
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/30 p-4">
                            {loadingOnboarding === userId ? (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" /> Cargando cuestionario...
                              </div>
                            ) : ob ? (
                              <div className="space-y-4">
                                {/* Score */}
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold">Puntuación:</span>
                                  <span className={`text-lg font-bold ${sc?.color}`}>
                                    {ob.score} / 50 pts — {sc?.text}
                                  </span>
                                </div>

                                {/* MC answers */}
                                <div>
                                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                                    Respuestas de opción múltiple
                                  </p>
                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {MC_KEYS.map((key) => {
                                      const val = ob.answers?.[key] ?? "";
                                      const label = mcOptionLabels[key]?.[val] || val || "—";
                                      const isRisky = riskyAnswers[key]?.includes(val);
                                      return (
                                        <div
                                          key={key}
                                          className={`rounded-lg border p-2 ${
                                            isRisky
                                              ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950"
                                              : "bg-background"
                                          }`}
                                        >
                                          <p className="text-xs font-medium text-muted-foreground">
                                            {questionTitles[key] || key}
                                          </p>
                                          <p className={`text-sm font-semibold ${isRisky ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
                                            {val.toUpperCase()}) {label}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Open-ended answers */}
                                <div>
                                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                                    Respuestas abiertas
                                  </p>
                                  <div className="space-y-2">
                                    {OPEN_KEYS.map((key) => {
                                      const val = ob.answers?.[key] ?? "";
                                      return (
                                        <div key={key} className="rounded-lg border bg-background p-3">
                                          <p className="text-xs font-medium text-muted-foreground">
                                            {questionTitles[key] || key}
                                          </p>
                                          <p className="mt-1 text-sm text-foreground">
                                            {val || <span className="italic text-muted-foreground">Sin respuesta</span>}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Este usuario no completó el cuestionario de adopción.
                              </p>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdoptions;

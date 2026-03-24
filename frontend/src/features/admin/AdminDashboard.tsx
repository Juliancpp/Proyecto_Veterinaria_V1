import { useEffect, useState } from "react";
import { PawPrint, Users, FileText, Hospital, HeartHandshake, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { petService } from "@/features/adoption/petService";
import { clinicService } from "@/features/clinics/clinicService";
import { reportService } from "@/features/report/reportService";
import { userService } from "@/services/userService";
import { adoptionService } from "@/services/adoptionService";

interface Stats {
  pets: number | null;
  users: number | null;
  reports: number | null;
  clinics: number | null;
  adoptions: number | null;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ pets: null, users: null, reports: null, clinics: null, adoptions: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const results: Stats = { pets: null, users: null, reports: null, clinics: null, adoptions: null };
      await Promise.allSettled([
        petService.getAvailablePets().then((d) => { results.pets = d.length; }),
        userService.getAll().then((d) => { results.users = d.length; }),
        reportService.getAll().then((d) => { results.reports = d.filter((r) => r.status === "pending").length; }),
        clinicService.getClinics().then((d) => { results.clinics = d.length; }),
        adoptionService.getAdoptionRequests().then((d) => { results.adoptions = d.filter((r) => r.status === "pending").length; }),
      ]);
      setStats(results);
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Mascotas registradas", value: stats.pets, icon: PawPrint, color: "text-primary" },
    { label: "Usuarios activos", value: stats.users, icon: Users, color: "text-secondary" },
    { label: "Adopciones pendientes", value: stats.adoptions, icon: HeartHandshake, color: "text-accent" },
    { label: "Reportes pendientes", value: stats.reports, icon: FileText, color: "text-orange-500" },
    { label: "Clínicas", value: stats.clinics, icon: Hospital, color: "text-muted-foreground" },
  ];

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Resumen general del sistema</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl bg-muted p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : s.value ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" /> Actividad reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Cargando estadísticas..."
              : "Sistema funcionando correctamente. Usa el menú lateral para gestionar mascotas, adopciones, reportes y clínicas."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

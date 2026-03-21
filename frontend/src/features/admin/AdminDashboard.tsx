import { PawPrint, Users, FileText, Hospital, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Mascotas registradas", value: "—", icon: PawPrint, color: "text-primary" },
  { label: "Usuarios activos", value: "—", icon: Users, color: "text-secondary" },
  { label: "Reportes pendientes", value: "—", icon: FileText, color: "text-accent" },
  { label: "Clínicas", value: "—", icon: Hospital, color: "text-muted-foreground" },
];

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Resumen general del sistema</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl bg-muted p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
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
            Conecta la API para ver estadísticas en tiempo real.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

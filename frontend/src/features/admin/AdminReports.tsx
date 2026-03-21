import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { reportService, type Report } from "@/features/report/reportService";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, variant: "outline" as const },
  approved: { label: "Aprobado", icon: CheckCircle, variant: "default" as const },
  rejected: { label: "Rechazado", icon: XCircle, variant: "destructive" as const },
};

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getAll().then(setReports).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await reportService.updateStatus(id, status);
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: status as Report["status"] } : r)));
    } catch {}
  };

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Reportes</h1>

      <Card className="mt-6 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ubicación</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Cargando...</TableCell></TableRow>
              ) : reports.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Sin reportes</TableCell></TableRow>
              ) : reports.map((r) => {
                const cfg = statusConfig[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.location}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{r.description}</TableCell>
                    <TableCell><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      {r.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "approved")}>Aprobar</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, "rejected")}>Rechazar</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { reportService, type Report } from "@/features/report/reportService";

const statusConfig = {
  pending: { label: "Pendiente", variant: "outline" as const },
  approved: { label: "Aprobado", variant: "default" as const },
  rejected: { label: "Rechazado", variant: "destructive" as const },
};

const StaffReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getAll().then(setReports).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Reportes</h1>
      <p className="mt-1 text-muted-foreground">Vista de solo lectura</p>

      <Card className="mt-6 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ubicación</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Cargando...</TableCell></TableRow>
              ) : reports.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Sin reportes</TableCell></TableRow>
              ) : reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.location}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{r.description}</TableCell>
                  <TableCell><Badge variant={statusConfig[r.status].variant}>{statusConfig[r.status].label}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffReports;

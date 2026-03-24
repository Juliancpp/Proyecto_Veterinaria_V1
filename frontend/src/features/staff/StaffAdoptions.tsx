import { useState, useEffect } from "react";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adoptionService, type AdoptionRequest } from "@/services/adoptionService";

const StaffAdoptions = () => {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adoptionService.getAdoptionRequests()
      .then((all) => setRequests(all.filter((r) => r.status === "approved")))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const handleEmail = (email: string, petName: string) => {
    const subject = encodeURIComponent(`Adopción aprobada - ${petName}`);
    const body = encodeURIComponent(
      `Hola,\n\nTu solicitud de adopción para ${petName} ha sido aprobada.\n\nPor favor contáctanos para coordinar la entrega.\n\nSaludos,\nEquipo PatitasHome`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">Adopciones Aprobadas</h1>
      <p className="mt-1 text-muted-foreground">Usuarios aprobados para contactar</p>

      <Card className="mt-6 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Fecha aprobación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay adopciones aprobadas pendientes de contactar
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.user_data?.name || "—"}</TableCell>
                    <TableCell className="text-sm">{r.user_data?.email || "—"}</TableCell>
                    <TableCell>{r.pet_data?.name || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(r.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmail(r.user_data?.email, r.pet_data?.name)}
                      >
                        <Mail className="mr-1 h-4 w-4" />
                        Contactar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAdoptions;

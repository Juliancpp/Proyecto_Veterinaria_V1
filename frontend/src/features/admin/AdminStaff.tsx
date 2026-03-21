import { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { userService, type UserRecord } from "@/services/userService";

const AdminStaff = () => {
  const [staff, setStaff] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAll()
      .then((all) => setStaff(all.filter((u) => u.role === "staff" || u.role === "admin")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Staff</h1>
        <Button><Plus className="mr-2 h-4 w-4" /> Agregar Staff</Button>
      </div>

      <Card className="mt-6 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Cargando...</TableCell></TableRow>
              ) : staff.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Sin staff</TableCell></TableRow>
              ) : staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell className="capitalize">{s.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStaff;

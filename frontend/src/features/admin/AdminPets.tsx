import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { petService } from "@/features/adoption/petService";
import type { Pet } from "@/store/petStore";

const AdminPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    petService.getAvailablePets().then(setPets).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Mascotas</h1>
        <Button><Plus className="mr-2 h-4 w-4" /> Agregar</Button>
      </div>

      <Card className="mt-6 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Cargando...</TableCell></TableRow>
              ) : pets.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Sin mascotas</TableCell></TableRow>
              ) : pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">{pet.name}</TableCell>
                  <TableCell>{pet.breed}</TableCell>
                  <TableCell>{pet.age}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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

export default AdminPets;

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { petService } from "@/features/adoption/petService";
import type { Pet } from "@/store/petStore";

const emptyForm = { name: "", breed: "", age: "", size: "medium", description: "" };

const AdminPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPets = () => {
    setLoading(true);
    petService.getAllPets()
      .then(setPets)
      .catch(() => petService.getAvailablePets().then(setPets).catch(() => setPets([])))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPets(); }, []);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar 5MB.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImage(null);
    setPreview(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.age.trim()) {
      setError("Nombre y edad son obligatorios.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await petService.createPet({ ...form, image: image ?? undefined });
      setOpen(false);
      resetForm();
      setSuccess("Mascota creada exitosamente.");
      loadPets();
    } catch (err: any) {
      const detail = err.response?.data;
      const msg = typeof detail === "string" ? detail : detail?.detail || JSON.stringify(detail) || "Error al crear mascota.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta mascota?")) return;
    try {
      await petService.deletePet(id);
      setSuccess("Mascota eliminada.");
      loadPets();
    } catch {
      setError("Error al eliminar mascota.");
    }
  };

  const sizeLabel: Record<string, string> = { small: "Pequeño", medium: "Mediano", large: "Grande" };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">Mascotas</h1>
        <Button onClick={() => { resetForm(); setOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Agregar
        </Button>
      </div>

      {success && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          {success}
        </div>
      )}

      <Card className="mt-6 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Tamaño</TableHead>
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
              ) : pets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Sin mascotas</TableCell>
                </TableRow>
              ) : (
                pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>{pet.breed}</TableCell>
                    <TableCell>{pet.age}</TableCell>
                    <TableCell>{sizeLabel[pet.size] || pet.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(pet.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Pet Dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Mascota</DialogTitle>
            <DialogDescription>Completa los datos de la nueva mascota.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Nombre *</label>
              <Input
                placeholder="Nombre de la mascota"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Raza</label>
              <Input
                placeholder="Ej: Labrador, Mestiza"
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Edad *</label>
                <Input
                  placeholder='Ej: 2 años'
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tamaño</label>
                <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeño</SelectItem>
                    <SelectItem value="medium">Mediano</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Descripción</label>
              <Textarea
                placeholder="Describe a la mascota..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                <ImageIcon className="mr-1 inline h-4 w-4" /> Foto
              </label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
              <Button type="button" variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
                {image ? image.name : "Seleccionar imagen"}
              </Button>
              {preview && (
                <img src={preview} alt="Preview" className="mt-3 h-32 w-full rounded-lg object-cover" />
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPets;

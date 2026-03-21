import { useState, useRef } from "react";
import { MapPin, Camera, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reportService } from "./reportService";

const ReportPage = () => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await reportService.create({ location, description, image: image ?? undefined });
      setSuccess(true);
      setLocation("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch {
      setError("Error al enviar el reporte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <CheckCircle className="h-16 w-16 text-secondary" />
        <h2 className="mt-4 font-display text-2xl font-bold text-foreground">¡Reporte enviado!</h2>
        <p className="mt-2 text-muted-foreground">Gracias por ayudar. Revisaremos tu reporte pronto.</p>
        <Button className="mt-6" onClick={() => setSuccess(false)}>
          Enviar otro reporte
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">
        Reportar <span className="gradient-text">mascota</span>
      </h1>
      <p className="mt-2 text-muted-foreground">¿Encontraste una mascota perdida? Ayúdanos a rescatarla.</p>

      <Card className="mt-6 border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                <MapPin className="mr-1 inline h-4 w-4" /> Ubicación
              </label>
              <Input
                placeholder="Dirección o descripción del lugar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Descripción</label>
              <Textarea
                placeholder="Describe al animal: color, tamaño, estado..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                <Camera className="mr-1 inline h-4 w-4" /> Foto (opcional)
              </label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="w-full">
                {image ? image.name : "Seleccionar imagen"}
              </Button>
              {preview && (
                <img src={preview} alt="Preview" className="mt-3 h-40 w-full rounded-lg object-cover" />
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Enviando..." : "Enviar reporte"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;

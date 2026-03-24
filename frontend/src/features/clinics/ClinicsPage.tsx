import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { clinicService, type Clinic } from "./clinicService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import "leaflet/dist/leaflet.css";

// Mock clinics for when API is unavailable
const mockClinics: Clinic[] = [
  { id: 1, name: "Clínica Veterinaria Quito Sur", phone: "+593 2 265 1234", address: "Av. Mariscal Sucre S14-72, Quito", latitude: -0.2295, longitude: -78.5243 },
  { id: 2, name: "Centro Veterinario Guayaquil", phone: "+593 4 230 5678", address: "Av. 9 de Octubre 1210, Guayaquil", latitude: -2.1894, longitude: -79.8891 },
  { id: 3, name: "Hospital Animal Cuenca", phone: "+593 7 284 9012", address: "Calle Larga 6-78, Cuenca", latitude: -2.9001, longitude: -79.0059 },
];

const ClinicsPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    clinicService
      .getClinics()
      .then((data) => setClinics(data.length > 0 ? data : mockClinics))
      .catch(() => setClinics(mockClinics))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        const L = await import("leaflet");

        // Fix default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current!).setView([-1.8312, -78.1834], 7);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        clinics.forEach((clinic) => {
          L.marker([clinic.latitude, clinic.longitude])
            .addTo(map)
            .bindPopup(
              `<div style="font-family: 'DM Sans', sans-serif;">
                <strong style="font-size: 14px;">${clinic.name}</strong><br/>
                <span style="color: #666; font-size: 12px;">Tel: ${clinic.phone}</span><br/>
                <span style="color: #666; font-size: 12px;">${clinic.address}</span>
              </div>`
            );
        });

        // Force a resize so tiles render correctly
        setTimeout(() => map.invalidateSize(), 200);
      } catch (err) {
        setError("Error al cargar el mapa.");
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, clinics]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="section-container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Clínicas <span className="gradient-text">Veterinarias</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encuentra clínicas cercanas para el cuidado de tu mascota
        </p>
      </motion.div>

      {error && (
        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 overflow-hidden rounded-2xl border border-border"
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        <div
          ref={mapRef}
          style={{ height: "500px", width: "100%", minHeight: "400px" }}
        />
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clinics.map((clinic, i) => (
          <motion.div
            key={clinic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="card-pet flex items-start gap-4 p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-foreground">{clinic.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{clinic.phone}</p>
              <p className="text-xs text-muted-foreground">{clinic.address}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClinicsPage;

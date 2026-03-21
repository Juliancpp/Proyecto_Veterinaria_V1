import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { clinicService, type Clinic } from "./clinicService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import "leaflet/dist/leaflet.css";

// Mock clinics for when API is unavailable
const mockClinics: Clinic[] = [
  { id: 1, name: "Clínica VetAmor", phone: "+57 301 111 2222", address: "Cra 15 #80-12, Bogotá", latitude: 4.6697, longitude: -74.0568 },
  { id: 2, name: "Centro Veterinario PetSalud", phone: "+57 302 333 4444", address: "Cll 100 #19-54, Bogotá", latitude: 4.6836, longitude: -74.0433 },
  { id: 3, name: "Hospital Animal Vida", phone: "+57 303 555 6666", address: "Cra 7 #45-23, Bogotá", latitude: 4.6351, longitude: -74.0703 },
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
      .then(setClinics)
      .catch(() => setClinics(mockClinics))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!mapRef.current || clinics.length === 0 || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([4.6597, -74.0568], 12);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      clinics.forEach((clinic) => {
        L.marker([clinic.latitude, clinic.longitude])
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'DM Sans', sans-serif;">
              <strong style="font-size: 14px;">${clinic.name}</strong><br/>
              <span style="color: #666; font-size: 12px;">📞 ${clinic.phone}</span><br/>
              <span style="color: #666; font-size: 12px;">📍 ${clinic.address}</span>
            </div>`
          );
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [clinics]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 overflow-hidden rounded-2xl border border-border"
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        <div ref={mapRef} className="h-[500px] w-full" />
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

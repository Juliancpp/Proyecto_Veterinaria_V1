import api from "@/services/api";

export interface Clinic {
  id: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface ClinicPayload {
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export const clinicService = {
  getClinics: async (): Promise<Clinic[]> => {
    const { data } = await api.get<Clinic[]>("/clinics/");
    return data;
  },
  createClinic: async (payload: ClinicPayload): Promise<Clinic> => {
    const { data } = await api.post<Clinic>("/clinics/", payload);
    return data;
  },
  deleteClinic: async (id: number): Promise<void> => {
    await api.delete(`/clinics/${id}/`);
  },
};

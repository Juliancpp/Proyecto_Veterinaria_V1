import api from "@/services/api";

export interface Clinic {
  id: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const clinicService = {
  getClinics: async (): Promise<Clinic[]> => {
    const { data } = await api.get<Clinic[]>("/clinics/");
    return data;
  },
};

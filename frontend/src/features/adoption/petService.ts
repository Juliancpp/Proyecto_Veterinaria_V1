import api from "@/services/api";
import type { Pet } from "@/store/petStore";

export const petService = {
  getAvailablePets: async (): Promise<Pet[]> => {
    const { data } = await api.get<Pet[]>("/pets/available/");
    return data;
  },
  likePet: async (petId: number) => {
    const { data } = await api.post(`/pets/${petId}/like/`);
    return data;
  },
};

import api from "@/services/api";
import type { Pet } from "@/store/petStore";

export interface LikedPetEntry {
  id: number;
  pet: Pet;
  liked: boolean;
  created_at: string;
  adoption_status: "pending" | "approved" | "rejected" | null;
}

export interface AdoptionRequest {
  id: number;
  user: number;
  pet: number;
  user_data: {
    id: number;
    name: string;
    email: string;
    role: string;
    onboarding_complete: boolean;
  };
  pet_data: Pet;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export const adoptionService = {
  getLikedPets: async (): Promise<LikedPetEntry[]> => {
    const { data } = await api.get<LikedPetEntry[]>("/likes/");
    return data;
  },

  createAdoptionRequest: async (petId: number): Promise<AdoptionRequest> => {
    const { data } = await api.post<AdoptionRequest>("/adoptions/", { pet: petId });
    return data;
  },

  getAdoptionRequests: async (): Promise<AdoptionRequest[]> => {
    const { data } = await api.get<AdoptionRequest[]>("/adoptions/");
    return data;
  },

  updateAdoptionStatus: async (id: number, status: string): Promise<AdoptionRequest> => {
    const { data } = await api.patch<AdoptionRequest>(`/adoptions/${id}/`, { status });
    return data;
  },
};

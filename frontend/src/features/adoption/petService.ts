import api from "@/services/api";
import type { Pet } from "@/store/petStore";

export interface PetPayload {
  name: string;
  breed: string;
  age: string;
  size: string;
  description: string;
  image?: File;
}

export const petService = {
  getAvailablePets: async (): Promise<Pet[]> => {
    const { data } = await api.get<Pet[]>("/pets/available/");
    return data;
  },
  getAllPets: async (): Promise<Pet[]> => {
    const { data } = await api.get<{ results: Pet[] }>("/pets/");
    return data.results ?? data as unknown as Pet[];
  },
  createPet: async (payload: PetPayload): Promise<Pet> => {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("breed", payload.breed);
    form.append("age", payload.age);
    form.append("size", payload.size);
    form.append("description", payload.description);
    if (payload.image) form.append("image", payload.image);
    const { data } = await api.post<Pet>("/pets/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  deletePet: async (id: number): Promise<void> => {
    await api.delete(`/pets/${id}/`);
  },
  likePet: async (petId: number) => {
    const { data } = await api.post(`/pets/${petId}/like/`);
    return data;
  },
  skipPet: async (petId: number) => {
    const { data } = await api.post(`/pets/${petId}/skip/`);
    return data;
  },
};

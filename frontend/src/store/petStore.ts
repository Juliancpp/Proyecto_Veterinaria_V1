import { create } from "zustand";

export interface Pet {
  id: number;
  name: string;
  age: string;
  breed: string;
  description: string;
  image: string;
}

interface PetState {
  pets: Pet[];
  likedPets: Pet[];
  currentIndex: number;
  setPets: (pets: Pet[]) => void;
  likePet: (pet: Pet) => void;
  nextPet: () => void;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  likedPets: [],
  currentIndex: 0,
  setPets: (pets) => set({ pets, currentIndex: 0 }),
  likePet: (pet) => set((state) => ({ likedPets: [...state.likedPets, pet] })),
  nextPet: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),
}));

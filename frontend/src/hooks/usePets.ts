import { useEffect } from "react";
import { usePetStore, type Pet } from "@/store/petStore";
import { petService } from "@/features/adoption/petService";
import { useFetch } from "./useFetch";

// Mock data for development
import dogSample1 from "@/assets/dog-sample-1.jpg";
import dogSample2 from "@/assets/dog-sample-2.jpg";
import dogSample3 from "@/assets/dog-sample-3.jpg";

const mockPets: Pet[] = [
  { id: 1, name: "Luna", age: "2 años", breed: "Mestiza", description: "Juguetona y cariñosa, busca un hogar lleno de amor.", image: dogSample1 },
  { id: 2, name: "Max", age: "3 años", breed: "Pitbull Mix", description: "Leal y protector, ideal para familias activas.", image: dogSample2 },
  { id: 3, name: "Buddy", age: "1 año", breed: "Labrador", description: "Cachorro enérgico que ama jugar al aire libre.", image: dogSample3 },
  { id: 4, name: "Canela", age: "4 años", breed: "Mestiza", description: "Tranquila y dulce, perfecta compañera de sofá.", image: dogSample1 },
  { id: 5, name: "Rocky", age: "2 años", breed: "Boxer Mix", description: "Fuerte y juguetón, necesita espacio para correr.", image: dogSample2 },
];

export const usePets = () => {
  const { pets, likedPets, currentIndex, setPets, likePet, nextPet } = usePetStore();
  const { data, loading, error } = useFetch(() => petService.getAvailablePets(), []);

  useEffect(() => {
    if (data && data.length > 0) {
      setPets(data);
    } else if (!loading && !data) {
      // Use mock data when API is unavailable
      setPets(mockPets);
    }
  }, [data, loading, setPets]);

  const currentPet = pets[currentIndex] || null;
  const hasMore = currentIndex < pets.length;

  const handleLike = () => {
    if (currentPet) {
      likePet(currentPet);
      nextPet();
    }
  };

  const handlePass = () => {
    nextPet();
  };

  return { currentPet, hasMore, likedPets, loading, error, handleLike, handlePass };
};

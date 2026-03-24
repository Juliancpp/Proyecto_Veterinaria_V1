import api from "@/services/api";

export interface OnboardingData {
  id: number;
  user: number;
  preferences: Record<string, any>;
  answers: Record<string, string>;
  score: number;
  completed: boolean;
  created_at: string;
}

export const onboardingService = {
  getByUser: async (userId: number): Promise<OnboardingData> => {
    const { data } = await api.get<OnboardingData>(`/onboarding/user/${userId}/`);
    return data;
  },
  getAll: async (): Promise<OnboardingData[]> => {
    const { data } = await api.get<OnboardingData[]>("/onboarding/");
    return data;
  },
};

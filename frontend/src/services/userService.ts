import api from "@/services/api";

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export const userService = {
  getAll: async (): Promise<UserRecord[]> => {
    const { data } = await api.get<UserRecord[]>("/users/");
    return data;
  },
  updateRole: async (id: number, role: string) => {
    const { data } = await api.patch(`/users/${id}/`, { role });
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/users/${id}/`);
  },
};

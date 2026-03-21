import api from "@/services/api";

export interface ReportPayload {
  location: string;
  description: string;
  image?: File;
}

export interface Report {
  id: number;
  location: string;
  description: string;
  image_url?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user_name?: string;
}

export const reportService = {
  create: async (payload: ReportPayload) => {
    const form = new FormData();
    form.append("location", payload.location);
    form.append("description", payload.description);
    if (payload.image) form.append("image", payload.image);
    const { data } = await api.post("/reports/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  getAll: async (): Promise<Report[]> => {
    const { data } = await api.get<Report[]>("/reports/");
    return data;
  },
  updateStatus: async (id: number, status: string) => {
    const { data } = await api.patch(`/reports/${id}/`, { status });
    return data;
  },
};

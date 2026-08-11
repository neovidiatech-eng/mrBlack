import api, { ApiResponse } from "@/lib/axios";
import { Lens } from "@/types/lens";

export const lensService = {
  getLenses: async () => {
    const response = await api.get<ApiResponse<Lens[]>>("/lenses");
    return response.data;
  },
};

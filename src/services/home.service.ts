import api from "@/lib/axios";
import { HomeResponse } from "@/types/home";

export const homeService = {
  getHomeData: async () => {
    const response = await api.get<HomeResponse>("/home");
    return response.data;
  },
};

import api from "@/lib/axios";
import { BannerResponse } from "@/types/banner";

export const bannerService = {
  getBanners: async () => {
    const response = await api.get<BannerResponse>("/banners");
    return response.data;
  },
};

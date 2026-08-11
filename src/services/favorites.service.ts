import api, { ApiResponse } from "@/lib/axios";
import { Product } from "@/types/product";

export const favoritesService = {
  getFavorites: async () => {
    const response = await api.get<ApiResponse<Product[]>>("/auth/favorites");
    return response.data;
  },

  toggleFavorite: async (productId: string) => {
    const response = await api.post<ApiResponse<any>>("/auth/favorites", {
      productId,
    });
    return response.data;
  },
};

import api, { ApiResponse } from "@/lib/axios";
import { Category, Product, PaginatedResponse } from "@/types/product";

export const categoryService = {
  getCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  getCategoryProducts: async (slug: string, page: number = 1, limit: number = 10) => {
    const response = await api.get<PaginatedResponse<Product>>(
      `/categories/${slug}/products?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

import api, { ApiResponse } from "@/lib/axios";
import { Product, PaginatedResponse, SingleProductData } from "@/types/product";

export const productService = {
  getProducts: async (page: number = 1, limit: number = 10) => {
    const response = await api.get<PaginatedResponse<Product>>(
      `/products?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getProductBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<SingleProductData>>(
      `/products/${slug}`,
    );
    return response.data;
  },

  getBestSellers: async (page: number = 1, limit: number = 10) => {
    const response = await api.get<ApiResponse<Product[]>>(
      `/products/best-sellers?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
  getRecentProducts: async (productIds: string[]) => {
    const params = new URLSearchParams();
    productIds.forEach((id) => params.append("productIds[]", id));
    
    const response = await api.get<ApiResponse<Product[]>>("/products/recent", {
      params,
    });
    return response.data;
  },
  getFeaturedProducts: async (page: number = 1, limit: number = 10) => {
    const response = await api.get<PaginatedResponse<Product>>(
      `/products?isFeatured=true&page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};

import api, { ApiResponse } from "@/lib/axios";
import { CreateOrderPayload, OrderResponseData } from "@/types/order";

export const orderService = {
  createOrder: async (payload: CreateOrderPayload) => {
    const { prescriptionFile, ...jsonPayload } = payload;
    const response = await api.post<ApiResponse<OrderResponseData>>(
      "/orders",
      jsonPayload,
    );
    return response.data;
  },

  trackOrder: async (orderNumber: string) => {
    const response = await api.get<ApiResponse<OrderResponseData>>(
      `/orders/${orderNumber}`,
    );
    return response.data;
  },

  getOrderHistory: async (page: number = 1, limit: number = 50) => {
    const response = await api.get<any>(
      `/orders/history?page=${page}&limit=${limit}`,
    );
    return response.data; // This matches OrderHistoryResponse
  },
};

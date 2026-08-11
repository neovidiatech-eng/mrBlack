import { useMutation, useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { CreateOrderPayload } from "@/types/order";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      orderService.createOrder(payload),
  });
};

export const useTrackOrder = (orderNumber: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["trackOrder", orderNumber],
    queryFn: () => orderService.trackOrder(orderNumber),
    enabled: enabled && !!orderNumber,
    retry: false,
  });
};

export const useOrderHistory = (page: number = 1, limit: number = 50, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["orderHistory", page, limit],
    queryFn: () => orderService.getOrderHistory(page, limit),
    enabled: enabled,
  });
};

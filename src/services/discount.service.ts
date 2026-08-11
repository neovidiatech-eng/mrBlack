import api, { ApiResponse } from "@/lib/axios";
import { CartData } from "@/types/cart";

export const discountService = {
  validateCoupon: async (couponCode: string) => {
    const response = await api.post<ApiResponse<CartData>>("/discounts/validate", {
      couponCode,
    });
    return response.data;
  },
};

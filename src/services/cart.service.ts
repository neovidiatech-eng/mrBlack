import api, { ApiResponse } from "@/lib/axios";
import { CartData } from "@/types/cart";

export const cartService = {
  getCart: async (couponCode?: string | null) => {
    // Fetching the cart is usually GET /cart
    const response = await api.get<ApiResponse<CartData>>("/cart", {
      params: { ...(couponCode ? { couponCode } : {}) },
    });
    return response.data;
  },

  addToCart: async (
    productId: string,
    variantId?: string | null,
    quantity: number = 1,
    lensId?: string | null,
    lensMaterialId?: string | null,
    prescription?: any,
    purchaseType?: "FRAME_ONLY" | "WITH_LENSES",
    prescriptionImage?: string,
  ) => {
    // Adding an item is POST /cart/items
    const response = await api.post<ApiResponse<CartData>>("/cart/items", {
      productId,
      variantId,
      quantity,
      lensId,
      lensMaterialId,
      prescription,
      purchaseType,
      prescriptionImage,
    });
    return response.data;
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const response = await api.put<ApiResponse<CartData>>(
      `/cart/items/${itemId}`,
      {
        quantity,
      },
    );
    return response.data;
  },

  removeCartItem: async (itemId: string) => {
    const response = await api.delete<ApiResponse<CartData>>(
      `/cart/items/${itemId}`,
    );
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete<ApiResponse<CartData>>("/cart");
    return response.data;
  },
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { discountService } from "@/services/discount.service";

export const useCartQuery = () => {
  const { couponCode } = useCartStore();
  return useQuery({
    queryKey: ["cart", couponCode],
    queryFn: () => cartService.getCart(couponCode),
  });
};

export const useValidateCoupon = () => {
  const queryClient = useQueryClient();
  const { setCouponCode } = useCartStore();

  return useMutation({
    mutationFn: (couponCode: string) =>
      discountService.validateCoupon(couponCode),
    onSuccess: (res, couponCode) => {
      setCouponCode(couponCode);
      // Invalidate cart to refetch with new coupon
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(res.message || "تم تطبيق كوبون الخصم بنجاح");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "حدث خطأ أثناء تطبيق الكوبون";
      toast.error(msg);
      setCouponCode(null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      quantity = 1,
      lensId,
      lensMaterialId,
      prescription,
      purchaseType,
      prescriptionImage,
    }: {
      productId: string;
      variantId?: string | null;
      quantity?: number;
      lensId?: string | null;
      lensMaterialId?: string | null;
      prescription?: any;
      purchaseType?: "FRAME_ONLY" | "WITH_LENSES";
      prescriptionImage?: string;
    }) =>
      cartService.addToCart(
        productId,
        variantId,
        quantity,
        lensId,
        lensMaterialId,
        prescription,
        purchaseType,
        prescriptionImage,
      ),
    onSuccess: (res) => {
      // Update every cached "cart" query (regardless of couponCode) with fresh data,
      // then invalidate to make sure it's in sync with the server.
      queryClient.setQueriesData({ queryKey: ["cart"] }, res);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(res.message || "تمت إضافة المنتج إلى السلة بنجاح");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "حدث خطأ أثناء إضافة المنتج للسلة";
      if (
        error?.response?.status === 401 ||
        msg.includes("غير مصرح") ||
        msg.includes("تسجيل الدخول")
      ) {
        toast.error("يرجى تسجيل الدخول أولاً لإضافة منتجات للسلة");
        router.push("/account");
        return;
      }
      toast.error(msg);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateQuantity(itemId, quantity),
    onSuccess: (res) => {
      queryClient.setQueriesData({ queryKey: ["cart"] }, res);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم تحديث كمية المنتج");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "حدث خطأ أثناء تحديث الكمية";
      toast.error(msg);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartService.removeCartItem(itemId),
    onSuccess: (res) => {
      queryClient.setQueriesData({ queryKey: ["cart"] }, res);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم إزالة المنتج من السلة");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "حدث خطأ أثناء إزالة المنتج";
      toast.error(msg);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (res) => {
      queryClient.setQueriesData({ queryKey: ["cart"] }, res);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("تم إفراغ السلة بنجاح");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ أثناء إفراغ السلة";
      toast.error(msg);
    },
  });
};

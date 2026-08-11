import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  couponCode: string | null;
  setCouponCode: (code: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      isCartOpen: false,
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      couponCode: null,
      setCouponCode: (code) => set({ couponCode: code }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ couponCode: state.couponCode }),
    }
  )
);

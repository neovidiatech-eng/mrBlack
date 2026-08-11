import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyStore {
  currencyCode: string | null;
  currencySymbol: string;
  setCurrency: (code: string, symbol: string) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currencyCode: null,
      currencySymbol: "ج.م",
      setCurrency: (code: string, symbol: string) =>
        set({ currencyCode: code, currencySymbol: symbol }),
    }),
    {
      name: "optical_currency",
    }
  )
);

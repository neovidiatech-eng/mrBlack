import { useQuery } from "@tanstack/react-query";
import api, { ApiResponse } from "@/lib/axios";

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: string;
  isBase: boolean;
  isActive: boolean;
}

export const useCurrencies = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Currency[]>>("/currencies");
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (currencies rarely change)
  });
};

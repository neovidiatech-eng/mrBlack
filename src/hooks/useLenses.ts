import { useQuery } from "@tanstack/react-query";
import { lensService } from "@/services/lens.service";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export const useLensesQuery = () => {
  const { currencyCode } = useCurrencyStore();

  return useQuery({
    queryKey: ["lenses", currencyCode],
    queryFn: () => lensService.getLenses(),
  });
};

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export const useBestSellers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["products", "best-sellers", page, limit],
    queryFn: () => productService.getBestSellers(page, limit),
  });
};
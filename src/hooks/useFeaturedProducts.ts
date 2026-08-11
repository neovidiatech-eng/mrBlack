import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";

export const useFeaturedProducts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["products", "featured", page, limit],
    queryFn: () => productService.getFeaturedProducts(page, limit),
  });
};

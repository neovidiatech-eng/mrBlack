import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

export const useProducts = (page: number = 1, limit: number = 10, categorySlug?: string) => {
  return useQuery({
    queryKey: ["products", page, limit, categorySlug],
    queryFn: () => categorySlug
      ? categoryService.getCategoryProducts(categorySlug, page, limit)
      : productService.getProducts(page, limit),
  });
};

export const useProductDetails = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
};

export const useRecentProducts = (productIds: string[]) => {
  return useQuery({
    queryKey: ["recentProducts", productIds],
    queryFn: () => productService.getRecentProducts(productIds),
    enabled: productIds.length > 0,
  });
};

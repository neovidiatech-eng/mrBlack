import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });
};

export const useCategoryProducts = (slug: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["categoryProducts", slug, page, limit],
    queryFn: () => categoryService.getCategoryProducts(slug, page, limit),
    enabled: !!slug,
  });
};

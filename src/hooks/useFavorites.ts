import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "@/services/favorites.service";
import { getAccessToken } from "@/lib/axios";
import { Product } from "@/types/product";
import { toast } from "react-toastify";

export const FAVORITES_QUERY_KEY = ["favorites"];

export function useFavorites() {
  const token = getAccessToken();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: favoritesService.getFavorites,
    enabled: !!token,
  });

  const favorites: Product[] = data?.data || [];

  return {
    favorites,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (productId: string) => favoritesService.toggleFavorite(productId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
      toast.success(res?.message || "تم تحديث المفضلة بنجاح");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "حدث خطأ أثناء تحديث المفضلة";
      toast.error(msg);
    },
  });

  return {
    toggleFavorite: mutation.mutate,
    toggleFavoriteAsync: mutation.mutateAsync,
    isToggling: mutation.isPending,
    error: mutation.error,
  };
}

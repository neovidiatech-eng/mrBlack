import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { ApiResponse } from "@/lib/axios";
import { toast } from "react-toastify";

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

export interface ReviewsResponse {
  items: Review[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const useProductReviews = (productId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["reviews", productId, page, limit],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ReviewsResponse>>(
        `/products/${productId}/reviews?page=${page}&limit=${limit}`
      );
      return data;
    },
    enabled: !!productId,
  });
};

interface AddReviewPayload {
  rating: number;
  comment?: string;
}

export const useAddReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddReviewPayload) => {
      const { data } = await api.post<ApiResponse<Review>>(
        `/products/${productId}/reviews`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "تم إضافة التقييم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      // Invalidate the product itself to update the overall rating and review count
      queryClient.invalidateQueries({ queryKey: ["product"] }); 
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إضافة التقييم");
    },
  });
};

"use client";

import { useState } from "react";
import { useProductReviews, useAddReview, Review } from "@/hooks/useReviews";
import { Star, UserCircle2 } from "lucide-react";
import Image from "next/image";

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const addReviewMutation = useAddReview(productId);
  
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  const reviews = reviewsData?.data?.items || [];
  const totalCount = reviewsData?.data?.totalCount || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    
    addReviewMutation.mutate(
      { rating, comment },
      {
        onSuccess: () => {
          setComment("");
        }
      }
    );
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">جاري تحميل المراجعات...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Review Form */}
      <div className="bg-[#faf9f8] p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-gray-900">أضف تقييمك</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">تقييمك للمنتج (من 5)</label>
            <div className="flex items-center gap-2" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-colors p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="comment" className="text-sm font-semibold text-gray-700">تعليقك (اختياري)</label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب رأيك في المنتج هنا..."
              className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-1 focus:ring-black resize-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={addReviewMutation.isPending}
            className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
          >
            {addReviewMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-bold mb-8 text-gray-900 flex items-center gap-2">
          آراء العملاء <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{totalCount} مراجعة</span>
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            لا توجد مراجعات حالياً. كن أول من يقيم هذا المنتج!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review: Review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                {/* User Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  {review.user?.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <Image src={review.user.imageUrl} alt={review.user.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <UserCircle2 className="w-12 h-12 text-gray-300 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{review.user?.name || "مستخدم غير معروف"}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-3" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} 
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

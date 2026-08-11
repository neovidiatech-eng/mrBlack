"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

export default function AccountFavoritesPage() {
  const { favorites, isLoading, error } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 ">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/account"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-black">المنتجات المفضلة</h1>
      </div>

      <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 md:p-10 min-h-[500px]">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 fill-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">قائمة الأمنيات</h2>
            <p className="text-sm text-gray-500">
              جميع المنتجات التي قمت بإضافتها إلى مفضلتك
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-500">جاري تحميل المفضلة...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold">
            حدث خطأ أثناء تحميل المفضلة.
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold mb-2">لا توجد منتجات مفضلة</h3>
            <p className="text-gray-500 mb-6">
              لم تقم بإضافة أي منتجات إلى قائمة المفضلة حتى الآن.
            </p>
            <Link
              href="/shop"
              className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              تصفح المتجر
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

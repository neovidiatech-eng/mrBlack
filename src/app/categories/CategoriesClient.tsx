"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types/product";

const fallbackImage =
  "https://images.unsplash.com/photo-1556306535-0f09a536f01f?auto=format&fit=crop&q=80&w=1200";

const getCardLayout = (index: number) => {
  const layouts = [
    "md:col-span-2 h-[300px] md:h-[400px]",
    "md:col-span-1 h-[300px] md:h-[400px]",
    "md:col-span-1 h-[300px]",
    "md:col-span-2 h-[300px]",
    "md:col-span-3 h-[300px] md:h-[400px]",
  ];

  return layouts[index % layouts.length];
};

export default function CategoriesClient() {
  const { data: categoriesResponse, isLoading, isError } = useCategories();
  const categories = [...(categoriesResponse?.data || [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="relative w-full rounded-3xl overflow-hidden bg-black text-white mb-12">
        <div className="absolute inset-0">
          <Image
            src={fallbackImage}
            alt="الأقسام"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-center min-h-[250px] md:min-h-[300px]">
          <div className="flex items-center gap-2 text-sm text-gray-300 font-bold mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-white">الأقسام</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            تصفح <span className="text-gray-400">الأقسام.</span>
          </h1>
          <p className="text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
            اكتشف مجموعتنا المتنوعة حسب الأقسام، واختر القسم المناسب للوصول
            إلى المنتجات والتصنيفات الفرعية مباشرة.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="min-h-[260px] flex items-center justify-center text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="min-h-[260px] flex items-center justify-center text-center text-gray-500 font-bold">
          تعذر تحميل الأقسام الآن.
        </div>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <div className="min-h-[260px] flex items-center justify-center text-center text-gray-500 font-bold">
          لا توجد أقسام متاحة حاليا.
        </div>
      )}

      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category: Category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`group relative rounded-3xl overflow-hidden bg-gray-100 ${getCardLayout(index)}`}
            >
              <Image
                src={category.imageUrl || fallbackImage}
                alt={category.name}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h2 className="text-2xl md:text-3xl font-black mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base font-medium mb-6 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {category.children?.length
                      ? `${category.children.length} أقسام فرعية`
                      : "تسوق منتجات هذا القسم"}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-full font-bold text-sm transition-colors">
                    تسوق الآن
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

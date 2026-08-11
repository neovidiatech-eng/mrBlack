"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
// استخدام الـ Hook الجديد
import { useBestSellers } from "@/hooks/useBestSeller"; 

export default function BestSellers() {
  // 1. تم التغيير هنا لاستدعاء الـ Hook الخاص بالأكثر مبيعاً
  const { data, isLoading } = useBestSellers(1, 10); 
  const products = data?.data || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // 2. فحص اتجاه الصفحة لضمان عمل الأسهم بشكل صحيح في الـ RTL
      const isRTL = document.documentElement.dir === "rtl";
      let scrollAmount = 300;

      if (direction === "left") {
        scrollAmount = isRTL ? 300 : -300;
      } else {
        scrollAmount = isRTL ? -300 : 300;
      }

      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2">الأكثر مبيعاً</h2>
              <p className="text-gray-500">التشكيلة المفضلة لدى عملائنا</p>
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden pb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] h-[400px] bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black mb-2">الأكثر مبيعاً</h2>
            <p className="text-gray-500">التشكيلة المفضلة لدى عملائنا</p>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
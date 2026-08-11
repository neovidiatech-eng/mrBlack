"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, Gem } from "lucide-react";
// import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { useHomeData } from "@/hooks/useHome";

export default function FeaturedProducts() {
  const { data: homeData, isLoading } = useHomeData();
  const products = homeData?.data?.featuredProducts || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-2 text-gray-900">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl  bg-[#c21913]/10 text-[#c21913]">
                  <Gem className="w-6 h-6" />
                </span>
                منتجات مميزة
              </h2>
              <p className="text-gray-500">
                اخترنا لك أفضل المنتجات وأكثرها تميزاً
              </p>
            </div>
          </div>
          <div className="flex gap-6 overflow-hidden pb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] md:min-w-[320px] h-[400px] bg-gray-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-white relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#c21913]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c21913]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3 text-gray-900">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-[#c21913] shadow-md">
                <Gem className="w-6 h-6" />
              </span>
              منتجات مميزة
            </h2>
            <p className="text-gray-500">
              اخترنا لك أفضل المنتجات وأكثرها تميزاً
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-[#c21913] hover:text-white hover:border-[#c21913] transition-all hover:scale-105"
              aria-label="السابق"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-[#c21913] hover:text-white hover:border-[#c21913] transition-all hover:scale-105"
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar p-2 -m-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="relative min-w-[280px] md:min-w-[320px] snap-start transition-transform hover:-translate-y-2"
            >
              <div className="absolute top-14 left-4 z-30 inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-[#c21913] p-2 text-xs font-bold shadow-lg ">
                <Gem className="w-5 h-5" />
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHomeData } from "@/hooks/useHome";
import ProductCard from "../shared/ProductCard";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NewArrivals() {
  const { data: homeData, isLoading } = useHomeData();
  const products = homeData?.data?.newArrivals || [];
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-2">
                <div className="w-10 h-10">
                  <DotLottieReact src="/check.lottie" loop autoplay />
                </div>
                وصل حديثاً
              </h2>
              <p className="text-gray-500">
                أحدث الموديلات التي انضمت لمجموعتنا
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-2">
              <div className="w-16 h-16">
                <DotLottieReact src="/check.lottie" loop autoplay />
              </div>
              وصل حديثاً
            </h2>
            <p className="text-gray-500">أحدث الموديلات التي انضمت لمجموعتنا</p>
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
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar p-2 -m-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[280px] md:min-w-[320px] snap-start transition-transform hover:-translate-y-2"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

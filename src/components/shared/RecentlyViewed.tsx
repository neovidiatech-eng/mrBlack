"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useRecentProducts } from "@/hooks/useProducts";

export default function RecentlyViewed() {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    // Clean up old storage for all devices that opened the site before
    localStorage.removeItem("optical_recently_viewed");

    const stored = localStorage.getItem("eyeware_recent_viewed_ids");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentIds(parsed);
        }
      } catch (e) {
        console.error("Failed to parse recently viewed products", e);
      }
    }
  }, []);

  const { data, isLoading } = useRecentProducts(recentIds);
  const recentProducts = data?.data || [];

  if (recentIds.length === 0 || (!isLoading && recentProducts.length === 0)) return null;

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
 <h2 className="text-3xl font-black mb-10 text-center ">
          <span className="text-[#C21913] mx-2">●</span>
          شاهدتها مؤخراً
          <span className="text-[#C21913] mx-2">●</span>
        </h2>        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentProducts.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

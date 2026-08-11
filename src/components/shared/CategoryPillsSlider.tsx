"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
// import { useProducts } from "@/hooks/useProducts";
import { useHomeData } from "@/hooks/useHome";
import { useCategories, useCategoryProducts } from "@/hooks/useCategories";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Category } from "@/types/product";

export default function CategoryPillsSlider() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* --- OLD CODE ---
  const { data, isLoading, isError } = useProducts(1, 20);
  const products = data?.items || [];

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.category) map.set(p.category.slug, p.category.name);
    });
    return [
      { id: "all", label: "الكل" },
      ...Array.from(map.entries()).map(([slug, name]) => ({
        id: slug,
        label: name,
      })),
    ];
  }, [products]);
  ------------------ */

  const {
    data: homeData,
    isLoading: isLoadingHome,
    isError: isHomeError,
  } = useHomeData();
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useCategories();
  const {
    data: categoryProductsData,
    isLoading: isLoadingCategoryProducts,
    isError: isCategoryProductsError,
  } = useCategoryProducts(
    activeCategory === "all" ? "" : activeCategory,
    1,
    20,
  );

  const defaultProducts = homeData?.data?.newArrivals || [];

  const categories = useMemo(() => {
    const apiCategories = categoriesData?.data || [];

    return [
      { id: "all", label: "الكل" },
      ...apiCategories.map((c: Category) => ({
        id: c.slug,
        label: c.name,
      })),
    ];
  }, [categoriesData?.data]);

  const filteredProducts =
    activeCategory === "all"
      ? defaultProducts
      : categoryProductsData?.items || [];
  const isLoading =
    isLoadingHome ||
    isLoadingCategories ||
    (activeCategory !== "all" && isLoadingCategoryProducts);
  const isError =
    isHomeError ||
    isCategoriesError ||
    (activeCategory !== "all" && isCategoryProductsError);

  return (
    <section className="py-16 bg-white overflow-visible">
      <div className="container mx-auto px-4">
        {/* Header with Title and Pills */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <h2 className="text-3xl font-black text-gray-900 shrink-0">
            اختياراتنا لك
          </h2>

          <div
            className="relative w-full md:w-64 shrink-0 z-20"
            ref={dropdownRef}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-6 py-3 rounded-full font-bold text-sm transition-all bg-white text-gray-900 shadow-sm border border-gray-200 hover:bg-gray-50"
            >
              <span>
                {categories.find((c) => c.id === activeCategory)?.label ||
                  "الكل"}
              </span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden origin-top"
                >
                  <ul
                    className="max-h-60 overflow-y-auto scrollbar-hide py-2"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() => {
                            setActiveCategory(cat.id);
                            setIsOpen(false);
                          }}
                          className={`w-full text-start px-6 py-3 text-sm font-bold transition-colors ${
                            activeCategory === cat.id
                              ? "bg-[##c21913]/10 text-[##c21913]"
                              : "text-gray-600 hover:bg-gray-50 hover:text-[##c21913]"
                          }`}
                        >
                          {cat.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[##c21913] rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20 text-gray-400">
            حدث خطأ في تحميل المنتجات، حاول مرة أخرى.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            لا توجد منتجات في هذا التصنيف حاليًا.
          </div>
        )}

        {/* Product Slider */}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[280px] w-[280px] md:w-1/4 snap-start shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Slider } from "@/components/ui/slider";
import { useCurrencyStore } from "@/store/useCurrencyStore";

function ShopContent() {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currencySymbol } = useCurrencyStore();

  const categorySlug = searchParams?.get("category");

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesData?.data || [];

  const { data: productsData, isLoading: isLoadingProducts } = useProducts(
    page,
    12,
    categorySlug || undefined,
  );
  const products = (productsData as any)?.data || productsData?.items || [];

  const totalItems = productsData?.pagination?.totalItems || 0;
  const totalPages = productsData?.pagination?.totalPages || 1;

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const uniqueBrands = Array.from(
    new Set(products.map((p: any) => p.brand).filter(Boolean)),
  );
  const maxPossiblePrice = Math.max(
    5000,
    ...products.map((p: any) => Number(p.price)),
  );

  useEffect(() => {
    if (products.length > 0 && maxPrice === 5000) {
      const highestPrice = Math.max(
        ...products.map((p: any) => Number(p.price)),
      );
      if (highestPrice > 0) {
        setMaxPrice(highestPrice);
      }
    }
  }, [products]);

  const filteredProducts = products.filter((p: any) => {
    const priceToCompare = Number(p.discountPrice || p.price);
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchesPrice =
      priceToCompare >= minPrice && priceToCompare <= maxPrice;
    return matchesBrand && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Premium Page Header */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-black text-white mb-10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=2000"
            alt="Shop Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-center min-h-[250px] md:min-h-[300px]">
          <div className="flex items-center gap-2 text-sm text-gray-300 font-bold mb-4">
            <a href="/" className="hover:text-white transition-colors">
              الرئيسية
            </a>
            <span>/</span>
            <span className="text-white">المتجر</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
            اكتشف ستايلك <span className="text-gray-400">الجديد.</span>
          </h1>
          <p className="text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
            تسوق أحدث تشكيلات الأحذية الفاخرة والعصرية لأشهر الماركات
            العالمية. صُممت لتناسب ذوقك وتعكس شخصيتك الفريدة.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b border-gray-100">
            <Filter className="w-5 h-5" />
            <span>تصفية النتائج</span>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="font-bold mb-4">القسم</h3>
            <div className="space-y-3 text-sm">
              {isLoadingCategories ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-5 bg-gray-200 animate-pulse rounded w-3/4"
                    ></div>
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="mb-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={categorySlug === category.slug}
                        onChange={() => {
                          if (categorySlug === category.slug) {
                            router.push("/shop");
                          } else {
                            router.push(`/shop?category=${category.slug}`);
                          }
                          setPage(1);
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      />
                      <span
                        className={`transition-colors ${categorySlug === category.slug ? "font-bold text-black" : "text-gray-600 group-hover:text-black"}`}
                      >
                        {category.name}
                      </span>
                    </label>

                    {category.children && category.children.length > 0 && (
                      <div className="mr-6 mt-2 space-y-2 border-r-2 border-gray-100 pr-3">
                        {category.children.map(
                          (child: {
                            id: string;
                            name: string;
                            slug: string;
                          }) => (
                            <label
                              key={child.id}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={categorySlug === child.slug}
                                onChange={() => {
                                  if (categorySlug === child.slug) {
                                    router.push("/shop");
                                  } else {
                                    router.push(`/shop?category=${child.slug}`);
                                  }
                                  setPage(1);
                                }}
                                className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                              />
                              <span
                                className={`text-sm transition-colors ${categorySlug === child.slug ? "font-bold text-black" : "text-gray-500 group-hover:text-black"}`}
                              >
                                {child.name}
                              </span>
                            </label>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-8">
            <h3 className="font-bold mb-4">الماركة</h3>
            <div className="space-y-3 text-sm">
              {uniqueBrands.map((brand: any) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBrands([...selectedBrands, brand]);
                      } else {
                        setSelectedBrands(
                          selectedBrands.filter((b) => b !== brand),
                        );
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span className="transition-colors group-hover:text-black text-gray-600 font-medium">
                    {brand}
                  </span>
                </label>
              ))}
              {uniqueBrands.length === 0 && !isLoadingProducts && (
                <span className="text-gray-400">لا توجد ماركات متاحة</span>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8 px-2">
            <h3 className="font-bold mb-6">نطاق السعر</h3>
            <Slider
              min={0}
              max={maxPossiblePrice}
              step={1}
              value={[minPrice, maxPrice]}
              onValueChange={(val) => {
                setMinPrice(val[0]);
                setMaxPrice(val[1]);
              }}
              className="mb-6"
            />
            <div className="flex items-center justify-between text-sm font-bold text-gray-700 bg-gray-50 py-3 px-4 rounded-xl">
              <span>
                {minPrice} {currencySymbol}
              </span>
              <span>
                {maxPrice} {currencySymbol}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content (Products) */}
        <div className="flex-1">
          {/* Top Bar: Sort & Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mb-8">
            <span className="text-sm text-gray-500 font-medium mb-4 sm:mb-0">
              {isLoadingProducts
                ? "جاري التحميل..."
                : `عرض ${filteredProducts.length} من أصل ${totalItems} منتج`}
            </span>
            {/* <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer outline-none">
                <option>الأحدث</option>
                <option>السعر: من الأقل للأعلى</option>
                <option>السعر: من الأعلى للأقل</option>
                <option>الأكثر مبيعاً</option>
              </select>
            </div> */}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoadingProducts ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-gray-200 animate-pulse rounded-2xl"
                ></div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                لا توجد منتجات مطابقة للبحث
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoadingProducts && totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-bold transition-colors ${
                    page === i + 1
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen">
          جاري التحميل...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

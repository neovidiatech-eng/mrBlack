"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Product } from "@/types/product";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { getAccessToken } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/useCart";
import { useCurrencyStore } from "@/store/useCurrencyStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { favorites } = useFavorites();
  const { toggleFavorite, isToggling } = useToggleFavorite();
  const { currencySymbol } = useCurrencyStore();

  if (!product) return null;

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = getAccessToken();
    if (!token) {
      router.push("/account");
      return;
    }
    toggleFavorite(product.id);
  };

  const {
    id,
    name,
    slug,
    price,
    discountPrice,
    brand,
    category,
    stockQty,
    isAvailable,
    images,
  } = product;

  const sortedImages =
    images && images.length > 0
      ? [...images].sort((a, b) => a.sortOrder - b.sortOrder)
      : [];

  const inStock = isAvailable && stockQty > 0;
  const hasVariants =
    product.pricingMode === "VARIANT_BASED" ||
    (product.variants && product.variants.length > 0) ||
    (product.productAttributes && product.productAttributes.length > 0);
  const averageRating = Number(product.averageRating || 0);
  const reviewsCount = product.reviewsCount || 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    direction: "rtl",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      emblaApi?.scrollPrev();
    },
    [emblaApi],
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      emblaApi?.scrollNext();
    },
    [emblaApi],
  );

  const scrollTo = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const { mutate: addToCart, isPending: isAdding } = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      router.push("/account");
      return;
    }
    if (isAdding) return;
    addToCart({ productId: id, quantity: 1 });
  };

  return (
    <div className="group relative border border-gray-100 rounded-2xl p-4 transition-all hover:shadow-lg hover:border-gray-200 bg-white flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {discountPrice && (
          <span className="bg-[#c21913] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            خصم{" "}
            {Math.round(
              ((Number(price) - Number(discountPrice)) / Number(price)) * 100,
            )}
            %
          </span>
        )}
        {!inStock && (
          <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            نفذت الكمية
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        disabled={isToggling}
        className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
        aria-label="تحديث المفضلة"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-500 hover:text-red-500"
          }`}
        />
      </button>

      {/* Image Slider */}
      <Link
        href={`/product/${slug}`}
        className="relative aspect-square mb-4 overflow-hidden rounded-xl block bg-gray-50"
      >
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {sortedImages.length > 0 ? (
              sortedImages.map((img) => (
                <div key={img.id} className="relative flex-[0_0_100%] h-full">
                  <Image
                    src={img.url}
                    alt={name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              ))
            ) : (
              <div className="flex-[0_0_100%] h-full flex items-center justify-center text-gray-300 text-sm">
                لا توجد صورة
              </div>
            )}
          </div>
        </div>

        {/* Arrows - تظهر فقط لو فيه أكتر من صورة، وعند الهوفر */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="الصورة السابقة"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="الصورة التالية"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {sortedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => scrollTo(e, index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === selectedIndex
                      ? "w-4 bg-accent"
                      : "w-1.5 bg-white/80 border border-gray-300"
                  }`}
                  aria-label={`الصورة ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1 font-medium">
          {brand} • {category?.name}
        </div>
        <Link href={`/product/${slug}`}>
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 hover:text-gray-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating Stars */}
        {(averageRating > 0 || reviewsCount > 0) && (
          <div className="flex items-center gap-1.5 mb-2" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${averageRating >= star ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`}
              />
            ))}
            <span className="text-[10px] text-gray-400 font-medium ml-1">
              ({reviewsCount})
            </span>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {discountPrice ? (
              <>
                <span className="text-lg font-black text-[#c21913]">
                  {discountPrice} {currencySymbol}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {price} {currencySymbol}
                </span>
              </>
            ) : (
              <span className="text-lg font-black text-gray-900">
                {price} {currencySymbol}
              </span>
            )}
          </div>

          {hasVariants ? (
            <Link
              href={`/product/${slug}`}
              className="px-4 h-10 rounded-full flex items-center justify-center transition-all bg-gray-100 text-gray-900 hover:bg-black hover:text-white hover:scale-105 font-bold text-sm"
            >
              يمكن تخصيصه
            </Link>
          ) : (
            <button
              disabled={!inStock}
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                inStock
                  ? "bg-gray-100 text-gray-900 hover:bg-[#c21913] hover:text-white hover:scale-105"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="أضف للسلة"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

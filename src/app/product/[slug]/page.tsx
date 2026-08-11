"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/shared/ProductCard";
import ProductReviews from "@/components/product/ProductReviews";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useProductDetails } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useLensesQuery } from "@/hooks/useLenses";
import { usePrescriptionsQuery } from "@/hooks/usePrescriptions";
import { useUploadPrescription } from "@/hooks/useUpload";
import { toast } from "react-toastify";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/axios";
import { useProfile } from "@/hooks/useProfile";
import { EyePrescriptionInput } from "@/types/prescription";
export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { data, isLoading, isError } = useProductDetails(params.slug);
  const PRODUCT = data?.data?.product;
  const RELATED = data?.data?.relatedProducts || [];
  const { currencySymbol } = useCurrencyStore();

  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // New States for Dynamic Selection
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [matchedVariant, setMatchedVariant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "description" | "additional" | "reviews"
  >("description");

  const [purchaseType, setPurchaseType] = useState<
    "FRAME_ONLY" | "WITH_LENSES"
  >("FRAME_ONLY");
  const [selectedLensId, setSelectedLensId] = useState<string | null>(null);

  // Prescription States
  const [rightEye, setRightEye] = useState<EyePrescriptionInput>({});
  const [leftEye, setLeftEye] = useState<EyePrescriptionInput>({});
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [useSavedImage, setUseSavedImage] = useState(false);

  const { profile } = useProfile();

  const { data: lensesData } = useLensesQuery();
  const lenses = lensesData?.data || [];

  const { data: prescriptionsData } = usePrescriptionsQuery();
  const prescriptionGroups = prescriptionsData?.data || [];

  const { mutateAsync: uploadPrescription } = useUploadPrescription();
  const { mutate: addToCart } = useAddToCart();

  useEffect(() => {
    if (PRODUCT?.images?.length) {
      setActiveImage(PRODUCT.images[0].url);
    }
  }, [PRODUCT]);

  // Auto-slide images
  useEffect(() => {
    const hasSelectedAttributes = Object.keys(selectedAttributes).length > 0;
    if (
      !PRODUCT?.images ||
      PRODUCT.images.length <= 1 ||
      isHovered ||
      hasSelectedAttributes
    )
      return;

    const intervalId = setInterval(() => {
      setActiveImage((currentActive) => {
        const currentIndex = PRODUCT.images.findIndex(
          (img: any) => img.url === currentActive,
        );
        // If current image is not in the array (e.g., variant image), start from 0
        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % PRODUCT.images.length;
        return PRODUCT.images[nextIndex].url;
      });
    }, 3500);

    return () => clearInterval(intervalId);
  }, [PRODUCT?.images, isHovered, selectedAttributes]);

  const handleAttributeSelect = (attributeId: string, valueId: string) => {
    const newSelected = { ...selectedAttributes, [attributeId]: valueId };
    setSelectedAttributes(newSelected);

    if (PRODUCT?.pricingMode === "VARIANT_BASED") {
      const isFullSelection = (PRODUCT.productAttributes || []).every(
        (attr: any) => newSelected[attr.id],
      );

      if (isFullSelection) {
        const matched = PRODUCT.variants?.find((v: any) => {
          return v.options.every((opt: any) => {
            return (
              newSelected[opt.productAttributeValue.productAttributeId] ===
              opt.productAttributeValueId
            );
          });
        });

        setMatchedVariant(matched || null);
        if (matched?.imageUrl) {
          setActiveImage(matched.imageUrl);
        }
      } else {
        setMatchedVariant(null);
      }
    }
  };

  const handleAddToCart = () => {
    if (!PRODUCT) return;

    // Prescription Validation
    const isWithLenses = purchaseType === "WITH_LENSES";

    // Determine the final image URL to send
    let finalImageUrl: string | undefined = undefined;
    if (isWithLenses) {
      if (useSavedImage && profile?.prescriptionImage) {
        finalImageUrl = profile.prescriptionImage;
      } else if (prescriptionImage) {
        finalImageUrl = prescriptionImage;
      }

      if (!finalImageUrl) {
        toast.error("يجب رفع صورة الروشتة لتأكيد المقاسات عند اختيار عدسات");
        return;
      }
    }

    // We are no longer collecting rightEye, leftEye, or notes here.
    // But the backend might require the prescription object to be present (even if empty)
    // to attach and save the prescriptionImage in the database.
    const prescriptionPayload = isWithLenses ? {} : undefined;

    if (PRODUCT.pricingMode === "VARIANT_BASED") {
      if (!matchedVariant) {
        toast.error("يرجى اختيار جميع الخيارات المتاحة للمنتج");
        return;
      }
      addToCart({
        productId: PRODUCT.id,
        variantId: matchedVariant.id,
        quantity: quantity,
        lensId: selectedLensId,
        prescription: prescriptionPayload,
        purchaseType: isWithLenses ? "WITH_LENSES" : "FRAME_ONLY",
        prescriptionImage: isWithLenses ? finalImageUrl : undefined,
      });
    } else {
      addToCart({
        productId: PRODUCT.id,
        variantId: null,
        quantity: quantity,
        lensId: selectedLensId,
        prescription: prescriptionPayload,
        purchaseType: isWithLenses ? "WITH_LENSES" : "FRAME_ONLY",
        prescriptionImage: isWithLenses ? finalImageUrl : undefined,
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Save to recently viewed
  useEffect(() => {
    if (!PRODUCT) return;
    try {
      const stored = localStorage.getItem("optical_recently_viewed");
      let recent = stored ? JSON.parse(stored) : [];

      recent = recent.filter((p: any) => p.id !== PRODUCT.id);

      recent.unshift({
        id: PRODUCT.id,
        name: PRODUCT.name,
        slug: PRODUCT.slug,
        price: PRODUCT.price,
        discountPrice: PRODUCT.discountPrice,
        image: PRODUCT.images?.[0]?.url || "",
        category: PRODUCT.category?.name,
        brand: PRODUCT.brand,
        inStock:
          PRODUCT.status === "in_stock" ||
          (PRODUCT.isAvailable && PRODUCT.stockQty > 0),
        pricingMode: PRODUCT.pricingMode,
        variants: PRODUCT.variants,
      });

      if (recent.length > 10) recent.pop();

      localStorage.setItem("optical_recently_viewed", JSON.stringify(recent));
    } catch (e) {
      console.error(e);
    }
  }, [PRODUCT]);

  // Remove from recently viewed if product is not found (deleted)
  useEffect(() => {
    if (!isLoading && (isError || !PRODUCT)) {
      try {
        const stored = localStorage.getItem("optical_recently_viewed");
        if (stored) {
          let recent = JSON.parse(stored);
          const initialLength = recent.length;
          recent = recent.filter((p: any) => p.slug !== params.slug);

          if (recent.length !== initialLength) {
            localStorage.setItem(
              "optical_recently_viewed",
              JSON.stringify(recent),
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isLoading, isError, PRODUCT, params.slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pb-32 lg:pb-20">
        <div className="flex flex-col lg:flex-row gap-12 mb-20 animate-pulse">
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-3xl bg-gray-200"></div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="h-40 bg-gray-200 rounded w-full mt-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !PRODUCT) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">عذراً، المنتج غير موجود</h1>
        <Link href="/shop" className="text-[#c21913] hover:underline">
          العودة إلى المتجر
        </Link>
      </div>
    );
  }

  const isVariantBased = PRODUCT.pricingMode === "VARIANT_BASED";

  let inStock = false;
  let stockQty = 0;

  // Accurately check availability based on status
  if (PRODUCT.status === "in_stock") {
    inStock = true;
  } else if (PRODUCT.status === "out_of_stock") {
    inStock = false;
  } else {
    inStock = PRODUCT.isAvailable && PRODUCT.stockQty > 0;
  }
  stockQty = PRODUCT.stockQty;

  if (isVariantBased && matchedVariant) {
    if (matchedVariant.status === "in_stock") {
      inStock = true;
    } else if (matchedVariant.status === "out_of_stock") {
      inStock = false;
    } else {
      inStock = matchedVariant.stockQty > 0;
    }
    stockQty = matchedVariant.stockQty;
  }

  let currentOriginalPrice: string | null = null;
  let currentDiscountPrice: string | null = null;
  let isRange = false;
  let rangeMin = 0;
  let rangeMax = 0;

  if (isVariantBased) {
    if (matchedVariant) {
      currentOriginalPrice = matchedVariant.price;
      currentDiscountPrice = matchedVariant.discountPrice || null;
    } else {
      const variantsPrices =
        PRODUCT.variants?.map((v: any) => Number(v.discountPrice || v.price)) ||
        [];
      rangeMin =
        variantsPrices.length > 0
          ? Math.min(...variantsPrices)
          : Number(PRODUCT.price);
      rangeMax =
        (PRODUCT.variants?.length || 0) > 0
          ? Math.max(
              ...(PRODUCT.variants || []).map((v: any) => Number(v.price)),
            )
          : Number(PRODUCT.price);

      if (rangeMin !== rangeMax && variantsPrices.length > 0) {
        isRange = true;
      } else {
        currentOriginalPrice = String(rangeMin);
      }
    }
  } else {
    currentOriginalPrice = PRODUCT.price;
    currentDiscountPrice = PRODUCT.discountPrice || null;
  }

  let extraCost = 0;
  if (selectedLensId) {
    const lens = lenses.find((l: any) => l.id === selectedLensId);
    if (lens) extraCost += Number(lens.price || 0);
  }
  if (rightEye.groupId) {
    const group = prescriptionGroups?.find(
      (g: any) => g.id === rightEye.groupId,
    );
    if (group) extraCost += Number(group.price || 0);
  }
  if (leftEye.groupId) {
    const group = prescriptionGroups?.find(
      (g: any) => g.id === leftEye.groupId,
    );
    if (group) extraCost += Number(group.price || 0);
  }

  if (extraCost > 0) {
    if (currentOriginalPrice)
      currentOriginalPrice = String(Number(currentOriginalPrice) + extraCost);
    if (currentDiscountPrice)
      currentDiscountPrice = String(Number(currentDiscountPrice) + extraCost);
    if (isRange) {
      rangeMin += extraCost;
      rangeMax += extraCost;
    }
  }

  const averageRating = Number(PRODUCT.averageRating);
  const reviewsCount = PRODUCT.reviewsCount || 0;
  const hasRating = Number.isFinite(averageRating) && averageRating > 0;
  const productAttributes = PRODUCT.productAttributes || [];
  const hasProductAttributes = isVariantBased && productAttributes.length > 0;

  const selectedLens = lenses.find((l) => l.id === selectedLensId);

  return (
    <>
      <div className="container mx-auto md:px-16 px-4 py-8 pb-32 lg:pb-20 max-w-8xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-10 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-black transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">
            المتجر
          </Link>
          {PRODUCT.category && (
            <>
              <span>/</span>
              <Link
                href={`/shop?category=${PRODUCT.categoryId}`}
                className="hover:text-black transition-colors"
              >
                {PRODUCT.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-black font-medium truncate max-w-[200px] md:max-w-xs">
            {PRODUCT.name}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 mb-16">
          {/* Product Images */}
          <div
            className="w-full lg:w-1/2  flex flex-col gap-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={
                  activeImage ||
                  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
                }
                alt={PRODUCT.name}
                fill
                className="object-contain p-8 mix-blend-multiply"
                priority
              />
              {currentDiscountPrice && currentOriginalPrice && (
                <div className="absolute top-6 right-6 bg-[#c21913] text-white font-bold px-4 py-2 rounded-xl text-lg shadow-lg">
                  خصم{" "}
                  {Math.round(
                    ((Number(currentOriginalPrice) -
                      Number(currentDiscountPrice)) /
                      Number(currentOriginalPrice)) *
                      100,
                  )}
                  %
                </div>
              )}
            </div>
            {PRODUCT.images && PRODUCT.images.length > 1 && (
              <div className="flex gap-4 mt-2 overflow-x-auto pb-2 hide-scrollbar">
                {PRODUCT.images.map((img: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`relative w-28 shrink-0 aspect-square rounded-2xl overflow-hidden bg-gray-50 border cursor-pointer hover:border-[#c21913] transition-all ${
                      activeImage === img.url
                        ? "border-[#c21913]  ring-[#c21913]"
                        : "border-gray-100 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${idx}`}
                      fill
                      className="object-contain p-2 mix-blend-multiply"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <div className="mb-3 text-sm font-bold text-gray-500 tracking-wider uppercase">
              {PRODUCT.brand}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-gray-900">
              {PRODUCT.name}
            </h1>

            {/* Rating Stars */}
            {hasRating && (
              <div
                className="flex items-center gap-2 mb-6 cursor-pointer"
                onClick={() => {
                  setActiveTab("reviews");
                  window.scrollTo({
                    top: document.body.scrollHeight / 2,
                    behavior: "smooth",
                  });
                }}
              >
                <div className="flex items-center" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${averageRating >= star ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({PRODUCT.reviewsCount || 0} تقييم)
                </span>
              </div>
            )}

            {/* Price Area */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              {isRange ? (
                <span className="text-3xl font-bold text-[#c21913]">
                  {rangeMin} - {rangeMax} {currencySymbol}
                </span>
              ) : currentDiscountPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#c21913]">
                    {currentDiscountPrice} {currencySymbol}
                  </span>
                  <span className="text-xl text-gray-400 line-through font-medium">
                    {currentOriginalPrice} {currencySymbol}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {currentOriginalPrice} {currencySymbol}
                </span>
              )}
            </div>

            <div
              className="text-gray-600 leading-relaxed mb-8 text-lg"
              dangerouslySetInnerHTML={{ __html: PRODUCT.descShort }}
            />

            {/* Sequential Attributes Selection */}
            {hasProductAttributes && (
              <div className="mb-10 flex flex-col gap-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  الخيارات المتاحة:
                </h3>
                {productAttributes.map((attr: any) => (
                  <div key={attr.id} className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">
                      {attr.attribute.name}
                    </label>
                    <Select
                      value={selectedAttributes[attr.id] || undefined}
                      onValueChange={(val) =>
                        handleAttributeSelect(attr.id, val)
                      }
                    >
                      <SelectTrigger
                        dir="rtl"
                        className="w-full bg-transparent border-b-2 border-x-0 border-t-0 border-gray-200 py-3 px-0 text-gray-800 font-bold focus:ring-0 focus:border-[#c21913] transition-all hover:border-gray-300 rounded-none shadow-none text-base"
                      >
                        <SelectValue placeholder="تحديد أحد الخيارات" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {attr.values.map((val: any) => (
                          <SelectItem key={val.id} value={val.id}>
                            {val.attributeValue.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Purchase Type Selection */}
            {PRODUCT.category?.slug !== "accessories" &&
              (lenses.length > 0 || prescriptionGroups.length > 0) && (
                <div className="mb-10 flex flex-col gap-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    نوع الشراء
                  </h3>
                  <div className="flex gap-4">
                    <button
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                        purchaseType === "FRAME_ONLY"
                          ? "border-[#c21913] bg-[#c21913] text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                      onClick={() => setPurchaseType("FRAME_ONLY")}
                    >
                      شراء الإطار فقط
                    </button>
                    <button
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                        purchaseType === "WITH_LENSES"
                          ? "border-[#c21913] bg-[#c21913] text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                      onClick={() => setPurchaseType("WITH_LENSES")}
                    >
                      شراء النظارة بالعدسات
                    </button>
                  </div>
                </div>
              )}

            {/* Lenses Selection */}
            {purchaseType === "WITH_LENSES" &&
              lenses.length > 0 &&
              PRODUCT.category?.slug !== "accessories" && (
                <div className="mb-10 flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center justify-between">
                    إضافة عدسة للنظارة
                    <span className="text-xs text-gray-500 font-normal bg-gray-100 px-2 py-1 rounded-md">
                      اختياري
                    </span>
                  </label>

                  <Select
                    value={selectedLensId || "none"}
                    onValueChange={(val) =>
                      setSelectedLensId(val === "none" ? null : val)
                    }
                  >
                    <SelectTrigger
                      dir="rtl"
                      className="w-full bg-white border-2 border-gray-200 h-14 rounded-xl px-4 text-gray-800 font-bold focus:ring-0 focus:border-[#c21913] transition-all hover:border-gray-300 shadow-sm text-base"
                    >
                      <SelectValue placeholder="بدون عدسة إضافية (الإطار فقط)" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="none">
                        بدون عدسة إضافية (الإطار فقط)
                      </SelectItem>
                      {lenses.map((lens: any) => (
                        <SelectItem key={lens.id} value={lens.id}>
                          {lens.name} (+{lens.price} {currencySymbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedLens?.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedLens.description}
                    </p>
                  )}
                </div>
              )}

            {/* Prescription Selection */}
            {/* {purchaseType === "WITH_LENSES" && prescriptionGroups.length > 0 &&
              PRODUCT.category?.slug !== "accessories" && (
                <div className="mb-10 flex flex-col gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900">
                    تفاصيل مقاس النظر (الروشتة)
                  </h3>

                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-md text-[#c21913]">
                      العين اليمنى (Right Eye - OD)
                    </h4>
                    <div className="select-wrapper">
                      <select
                        className="select-modern"
                        value={rightEye.groupId || ""}
                        onChange={(e) =>
                          setRightEye({
                            ...rightEye,
                            groupId: e.target.value || undefined,
                          })
                        }
                      >
                        <option value="">اختر نوع العدسة (اختياري)</option>
                        {prescriptionGroups.map((group: any) => (
                          <option key={`right-${group.id}`} value={group.id}>
                            {group.name} (+{group.price} {currencySymbol})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="select-chevron" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                    <h4 className="font-bold text-md text-[#c21913]">
                      العين اليسرى (Left Eye - OS)
                    </h4>
                    <div className="select-wrapper">
                      <select
                        className="select-modern"
                        value={leftEye.groupId || ""}
                        onChange={(e) =>
                          setLeftEye({
                            ...leftEye,
                            groupId: e.target.value || undefined,
                          })
                        }
                      >
                        <option value="">اختر نوع العدسة (اختياري)</option>
                        {prescriptionGroups.map((group: any) => (
                          <option key={`left-${group.id}`} value={group.id}>
                            {group.name} (+{group.price} {currencySymbol})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="select-chevron" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">
                        ملاحظات إضافية
                      </label>
                      <textarea
                        className="select-modern !h-auto !py-3 resize-none"
                        rows={2}
                        placeholder="أدخل أي ملاحظات حول مقاسات النظر..."
                        value={prescriptionNotes}
                        onChange={(e) => setPrescriptionNotes(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        صورة الروشتة
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                          مطلوب
                        </span>
                      </label>

                      {profile?.prescriptionImage && (
                        <div className="mb-2">
                          <label className="flex items-center gap-2 cursor-pointer bg-blue-50/50 p-3 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={useSavedImage}
                              onChange={(e) =>
                                setUseSavedImage(e.target.checked)
                              }
                              className="w-5 h-5 rounded border-gray-300 text-[#c21913] focus:ring-[#c21913]"
                            />
                            <span className="text-sm font-bold text-blue-900">
                              استخدام صورتي الطبية المحفوظة في حسابي
                            </span>
                          </label>
                        </div>
                      )}

                      {!useSavedImage &&
                        (!prescriptionImage ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setIsUploading(true);
                                  try {
                                    const res = await uploadPrescription(file);
                                    setPrescriptionImage(res.data.imageUrl);
                                    toast.success("تم رفع الروشتة بنجاح");
                                  } catch (error) {
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isUploading}
                            />
                            <div
                              className={`select-modern flex items-center justify-center gap-2 border-dashed border-2 ${isUploading ? "bg-gray-100 text-gray-400" : "hover:border-[#c21913] hover:text-[#c21913] text-gray-500"}`}
                            >
                              {isUploading
                                ? "جاري الرفع..."
                                : "اختر ملف الصورة للروشتة"}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 border rounded-xl border-green-200 bg-green-50">
                            <span className="text-sm font-bold text-green-700">
                              تم إرفاق الصورة بنجاح
                            </span>
                            <button
                              onClick={() => setPrescriptionImage(null)}
                              className="text-xs font-bold text-red-500 hover:underline"
                            >
                              حذف
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )} */}

            {/* Standalone Prescription Image Upload */}
            {purchaseType === "WITH_LENSES" && (
              <div className="mb-10 flex flex-col gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">
                    صورة الروشتة (مطلوب)
                  </label>

                  {profile?.prescriptionImage && (
                    <div className="flex items-center gap-2 mt-1 mb-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <input
                        type="checkbox"
                        id="useSavedImage"
                        checked={useSavedImage}
                        onChange={(e) => setUseSavedImage(e.target.checked)}
                        className="w-4 h-4 text-[#c21913] border-gray-300 rounded focus:ring-[#c21913]"
                      />
                      <label
                        htmlFor="useSavedImage"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        استخدام صورتي الطبية المحفوظة في حسابي
                      </label>
                    </div>
                  )}

                  {!useSavedImage &&
                    (!prescriptionImage ? (
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setIsUploading(true);
                              try {
                                const res = await uploadPrescription(
                                  e.target.files[0],
                                );
                                setPrescriptionImage(res.data.imageUrl);
                                toast.success("تم رفع الروشتة بنجاح");
                              } catch (error) {
                                toast.error("حدث خطأ أثناء رفع الصورة");
                              } finally {
                                setIsUploading(false);
                              }
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isUploading}
                        />
                        <div
                          className={`select-modern flex items-center justify-center gap-2 border-dashed border-2 ${
                            isUploading
                              ? "bg-gray-100 text-gray-400"
                              : "hover:border-[#c21913] hover:text-[#c21913] text-gray-500"
                          }`}
                        >
                          {isUploading
                            ? "جاري الرفع..."
                            : "اختر ملف الصورة للروشتة"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border rounded-xl border-green-200 bg-green-50">
                        <span className="text-sm font-bold text-green-700">
                          تم إرفاق الصورة بنجاح
                        </span>
                        <button
                          onClick={() => setPrescriptionImage(null)}
                          className="text-xs font-bold text-red-500 hover:underline"
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Action Area (Desktop) */}
            <div className="bg-[#faf9f8] p-8 rounded-3xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-lg text-gray-900">
                  حالة التوفر:
                </span>
                {inStock ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 text-green-700 font-bold bg-green-50 border border-green-200 px-4 py-1.5 rounded-full shadow-sm">
                      <Check className="w-4 h-4" /> متوفر
                    </span>
                    {stockQty > 0 && stockQty <= 5 && (
                      <span className="flex items-center gap-1 text-[#c21913] font-bold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full animate-pulse shadow-sm text-sm">
                        باقي {stockQty} فقط!
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="flex items-center gap-2 text-red-600 font-bold bg-red-50 border border-red-200 px-4 py-1.5 rounded-full shadow-sm">
                    غير متوفر
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  disabled={!inStock}
                  onClick={handleAddToCart}
                  className={`hidden lg:flex flex-1 h-16 rounded-2xl items-center justify-center gap-3 font-bold text-xl transition-all ${
                    inStock
                      ? added
                        ? "bg-green-500 text-white shadow-lg shadow-green-200"
                        : "bg-black text-white hover:bg-[#c21913] hover:shadow-xl hover:-translate-y-1"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {added ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <ShoppingCart className="w-6 h-6" />
                  )}
                  {inStock
                    ? added
                      ? "تمت الإضافة للسلة بنجاح!"
                      : "أضف إلى السلة"
                    : "غير متوفر حالياً"}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-8">
                <div className="flex flex-col items-center text-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-medium">دفع آمن ١٠٠٪</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                  <Truck className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-medium">توصيل سريع</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                  <RotateCcw className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-medium">إرجاع سهل</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs (Smooth & Creative) */}
        <div className="mt-24 mb-20">
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-12 border-b border-gray-100 pb-0">
            <button
              onClick={() => setActiveTab("description")}
              className={`text-lg md:text-xl transition-all px-4 pb-4 ${activeTab === "description" ? "font-bold text-[#c21913] border-b-2 border-[#c21913]" : "text-gray-500 hover:text-gray-900"}`}
            >
              الوصف
            </button>
            <button
              onClick={() => setActiveTab("additional")}
              className={`text-lg md:text-xl transition-all px-4 pb-4 ${activeTab === "additional" ? "font-bold text-[#c21913] border-b-2 border-[#c21913]" : "text-gray-500 hover:text-gray-900"}`}
            >
              معلومات إضافية
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-lg md:text-xl transition-all px-4 pb-4 ${activeTab === "reviews" ? "font-bold text-[#c21913] border-b-2 border-[#c21913]" : "text-gray-500 hover:text-gray-900"}`}
            >
              مراجعات ({PRODUCT.reviewsCount || 0})
            </button>
          </div>

          <div className="py-4 flex justify-center max-w-4xl mx-auto">
            {activeTab === "description" && (
              <div className="prose max-w-none text-gray-600 leading-relaxed text-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                {PRODUCT.descLong ? (
                  <div dangerouslySetInnerHTML={{ __html: PRODUCT.descLong }} />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: PRODUCT.descShort }}
                  />
                )}
              </div>
            )}

            {activeTab === "additional" && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {PRODUCT.isFeatured && PRODUCT.featuredNote ? (
                  <div className="bg-[#faf9f8] border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm text-center">
                    <div className="flex flex-col items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                        <ShieldCheck className="w-8 h-8 text-[#c21913]" />
                      </div>
                      <h3 className="font-bold text-2xl text-gray-900">
                        مميزات المنتج
                      </h3>
                    </div>
                    <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                      {PRODUCT.featuredNote}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12 text-lg">
                    لا توجد معلومات إضافية حالياً.
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews productId={PRODUCT.id} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {RELATED.length > 0 && (
          <section className="pt-16 border-t border-gray-100">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900">
                منتجات مشابهة قد تعجبك
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {RELATED.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 flex items-center gap-4">
        <div className="flex flex-col flex-1">
          {isRange ? (
            <span className="text-lg font-black text-[#c21913]">
              {rangeMin} - {rangeMax} {currencySymbol}
            </span>
          ) : currentDiscountPrice ? (
            <>
              <span className="text-xs text-gray-500 line-through">
                {currentOriginalPrice} {currencySymbol}
              </span>
              <span className="text-lg font-black text-[#c21913]">
                {currentDiscountPrice} {currencySymbol}
              </span>
            </>
          ) : (
            <span className="text-lg font-black text-[#c21913]">
              {currentOriginalPrice} {currencySymbol}
            </span>
          )}
        </div>
        <button
          disabled={!inStock}
          onClick={handleAddToCart}
          className={`flex-1 h-14 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all ${
            inStock
              ? added
                ? "bg-green-500 text-white"
                : "bg-black text-white hover:bg-[#c21913]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {added ? (
            <Check className="w-5 h-5" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
          {inStock ? (added ? "تمت الإضافة!" : "أضف للسلة") : "غير متوفر"}
        </button>
      </div>
    </>
  );
}

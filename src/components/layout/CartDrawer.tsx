"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useCartQuery,
  useUpdateCartItem,
  useRemoveCartItem,
} from "@/hooks/useCart";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isCartOpen, setIsCartOpen } = useCartStore(); // if we still need to read isCartOpen from store, but the prop isOpen is passed. So we can just ignore items from store.
  const { data: cartData } = useCartQuery();
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { currencySymbol } = useCurrencyStore();

  const items = cartData?.data?.items || [];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total =
    cartData?.data?.totalAmount ??
    cartData?.data?.total ??
    cartData?.data?.subtotal ??
    items.reduce((acc: number, item: any) => {
      let itemPrice = Number(item.price ?? 0);
      if (!itemPrice) {
        itemPrice = item.variant
          ? item.variant.discountPrice
            ? Number(item.variant.discountPrice)
            : Number(item.variant.price)
          : item.product?.discountPrice
            ? Number(item.product.discountPrice)
            : Number(item.product?.price ?? 0);

        const lensPrice = Number(item.lens?.price ?? 0);
        const rightEyePrice = Number(item.prescription?.rightEye?.price ?? 0);
        const leftEyePrice = Number(item.prescription?.leftEye?.price ?? 0);

        itemPrice += lensPrice + rightEyePrice + leftEyePrice;
      }
      return acc + itemPrice * item.quantity;
    }, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Drawer Wrapper */}
      <div
        className={`fixed inset-0 z-[70] pointer-events-none overflow-hidden transition-all ${isOpen ? "visible" : "invisible delay-300"}`}
      >
        {/* Drawer */}
        <div
          className="absolute top-0 left-0 h-[100dvh] w-full md:w-[400px] bg-white pointer-events-auto shadow-2xl transition-transform duration-300 ease-in-out flex flex-col"
          style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 h-[70px] shrink-0">
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center border-2 border-black"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <h2 className="text-lg font-black flex items-center gap-2">
              <span className="text-gray-500 font-medium text-sm">
                ({items.length} منتج)
              </span>
              سلة التسوق
              <ShoppingBag className="w-5 h-5" />
            </h2>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 flex flex-col gap-6 flex-1">
                {/* Offers Banner */}
                <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-black" />
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    عروض 🎉
                  </span>
                </div>

                {/* Total Banner */}
                <div className="flex items-center justify-between mt-4">
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-lg text-gray-900">
                    الإجمالي (شامل التوصيل)
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  disabled
                  className="w-full h-14 bg-gray-200 text-gray-400 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 mt-4 cursor-not-allowed"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  انتقل إلى صفحة الدفع
                </button>
              </div>
            ) : (
              <div className="flex flex-col p-6 gap-6 h-full">
                {/* Offers Banner */}
                <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors shrink-0">
                  <ChevronLeft className="w-5 h-5 text-black" />
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    عروض 🎉
                  </span>
                </div>

                {/* Cart Items */}
                <div className="flex flex-col gap-6 flex-1 overflow-y-auto pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            item.variant?.imageUrl ||
                            item.product?.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80"
                          }
                          alt={item.product?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between gap-2 mb-1">
                          <div>
                            <h3 className="font-bold text-sm line-clamp-2">
                              {item.product?.name}
                            </h3>
                            {item.variant?.options && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.variant.options
                                  .map(
                                    (opt: any) =>
                                      opt.productAttributeValue?.attributeValue
                                        ?.value,
                                  )
                                  .join(" - ")}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.lens && (
                          <div className="text-[10px] text-accent font-medium mt-1 bg-accent/5 inline-block px-1.5 py-0.5 rounded-md">
                            + {item.lens.name}
                          </div>
                        )}
                        {item.prescription?.rightEye?.groupName && (
                          <div className="text-[10px] text-blue-600 font-medium mt-1 bg-blue-50 inline-block px-1.5 py-0.5 rounded-md">
                            يمين: {item.prescription.rightEye.groupName}
                          </div>
                        )}
                        {item.prescription?.leftEye?.groupName && (
                          <div className="text-[10px] text-blue-600 font-medium mt-1 bg-blue-50 inline-block px-1.5 py-0.5 rounded-md ml-1 mt-1">
                            يسار: {item.prescription.leftEye.groupName}
                          </div>
                        )}

                        <div className="font-black text-sm my-2 flex items-center gap-2">
                          {item.variant ? (
                            item.variant.discountPrice ? (
                              <>
                                <span>
                                  {item.variant.discountPrice} {currencySymbol}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  {item.variant.price} {currencySymbol}
                                </span>
                              </>
                            ) : (
                              <span>
                                {item.variant.price} {currencySymbol}
                              </span>
                            )
                          ) : item.product?.discountPrice ? (
                            <>
                              <span>
                                {item.product.discountPrice} {currencySymbol}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {item.product.price} {currencySymbol}
                              </span>
                            </>
                          ) : (
                            <span>
                              {item.product?.price} {currencySymbol}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-auto">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity({
                                  itemId: item.id,
                                  quantity: Math.max(1, item.quantity - 1),
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity({
                                  itemId: item.id,
                                  quantity: item.quantity + 1,
                                })
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Banner */}
                <div className="flex items-center justify-between mt-auto shrink-0 pt-4 border-t border-gray-100">
                  <span className="font-bold text-xl text-gray-900">
                    {total} {currencySymbol}
                  </span>
                  <span className="font-bold text-lg text-gray-900">
                    الإجمالي (شامل التوصيل)
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full h-14 bg-black text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 mt-4 hover:bg-gray-900 transition-colors shrink-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  انتقل إلى صفحة الدفع
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

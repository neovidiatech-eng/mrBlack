"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCartQuery, useUpdateCartItem, useRemoveCartItem } from "@/hooks/useCart";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function CartPage() {
  const { data: cartData } = useCartQuery();
  const { mutate: updateQuantity } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { currencySymbol } = useCurrencyStore();

  const items = cartData?.data?.items || [];
  const total =
    cartData?.data?.totalAmount ?? cartData?.data?.total ?? cartData?.data?.subtotal ?? 0;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h1 className="text-3xl font-black mb-4">سلة التسوق فارغة</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          لم تقم بإضافة أي منتجات إلى سلة التسوق الخاصة بك حتى الآن. اكتشف أحدث
          تشكيلات الأحذية وأضفها للسلة.
        </p>
        <Link
          href="/shop"
          className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
        >
          العودة للتسوق <ArrowRight className="w-5 h-5 rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20 min-h-[60vh]">
      <h1 className="text-4xl font-black mb-8">سلة التسوق</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500">
              <div className="col-span-6">المنتج</div>
              <div className="col-span-2 text-center">السعر</div>
              <div className="col-span-2 text-center">الكمية</div>
              <div className="col-span-2 text-left">الإجمالي</div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const reachedMax = item.quantity >= item.product?.stockQty;
                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 items-center"
                  >
                    {/* Product Info */}
                    <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <Image
                          src={item.variant?.imageUrl || item.product?.images?.[0]?.url || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80"}
                          alt={item.product?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base line-clamp-2 mb-1">
                          {item.product?.name}
                        </h3>
                        {item.variant?.options && (
                          <div className="text-xs text-gray-500 mb-1">
                            {item.variant.options.map((opt: any) => opt.productAttributeValue?.attributeValue?.value).join(" - ")}
                          </div>
                        )}
                        {item.prescription?.rightEye?.groupName && (
                          <div className="text-xs text-blue-600 font-medium mt-1 bg-blue-50 inline-block px-1.5 py-0.5 rounded-md">
                            يمين: {item.prescription.rightEye.groupName}
                          </div>
                        )}
                        {item.prescription?.leftEye?.groupName && (
                          <div className="text-xs text-blue-600 font-medium mt-1 bg-blue-50 inline-block px-1.5 py-0.5 rounded-md ml-1 mt-1">
                            يسار: {item.prescription.leftEye.groupName}
                          </div>
                        )}
                        {item.lens && (
                          <div className="text-xs text-accent font-medium mb-2 bg-accent/5 inline-block px-2 py-1 rounded-md">
                            + {item.lens.name}
                          </div>
                        )}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> إزالة
                        </button>
                      </div>
                    </div>

                    {/* Price (Mobile & Desktop) */}
                    <div className="col-span-1 sm:col-span-2 text-center hidden sm:block font-bold">
                      <span>{item.price ?? item.total ?? item.totalPrice ?? item.variant?.price ?? item.product?.price} {currencySymbol || "ج.م"}</span>
                    </div>

                    {/* Quantity & Price (Mobile stacked, Desktop grid) */}
                    <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center mt-4 sm:mt-0">
                      <span className="sm:hidden text-gray-500 font-medium">
                        الكمية:
                      </span>
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded shadow-sm transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                            disabled={reachedMax}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {reachedMax && (
                          <span className="text-[11px] text-amber-600 font-medium">
                            الحد الأقصى للمخزون
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Total line item price */}
                    <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-end items-center mt-2 sm:mt-0 font-black text-lg">
                      <span className="sm:hidden text-gray-500 font-medium text-base">
                        الإجمالي:
                      </span>
                      {item.total} {currencySymbol || "ج.م"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-black mb-6">ملخص الطلب</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center text-gray-600">
                <span>المجموع الفرعي</span>
                <span className="font-bold">{total} {currencySymbol || "ج.م"}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>الشحن والتوصيل</span>
                <span className="font-bold text-green-600">
                  يُحدد في صفحة الدفع
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">الإجمالي الكلي</span>
              <span className="text-3xl font-black">{total} {currencySymbol || "ج.م"}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full h-14 bg-black text-white rounded-xl font-bold text-lg flex items-center justify-center hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              متابعة لإتمام الطلب
            </Link>

            <p className="text-center text-xs text-gray-400 mt-4">
              ضرائب القيمة المضافة مشمولة إن وجدت
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  Tag,
  X,
  Copy,
  Check,
  Upload,
  FileImage,
  AlertTriangle,
  Receipt,
  Smartphone,
  Zap,
  Building2,
  PhoneCall,
  MapPin,
  User,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useCartQuery, useClearCart, useValidateCoupon } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrder";
import { useUploadReceipt } from "@/hooks/useUpload";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { PAYMENT_ACCOUNTS, PAYMENT_METHODS_LIST } from "@/consts/payment";
import { PaymentMethod, OrderResponseData } from "@/types/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EGYPT_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];

const checkoutSchema = z.object({
  fullName: z.string().min(2, "الاسم بالكامل مطلوب (حرفين على الأقل)"),
  phone: z
    .string()
    .min(8, "رقم الهاتف غير صحيح (8 أرقام على الأقل)"),
  governorate: z.string().min(1, "يرجى اختيار المحافظة"),
  address: z.string().min(5, "العنوان التفصيلي مطلوب للتوصيل"),
  paymentMethod: z.enum(
    ["INSTAPAY", "VODAFONE_CASH", "ORANGE_CASH", "ETISALAT_CASH", "WE_PAY"],
    { message: "يرجى اختيار طريقة الدفع" }
  ),
  senderPhone: z
    .string()
    .min(8, "يرجى إدخال رقم الهاتف / المحفظة المحول منها (8 أرقام على الأقل)"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { data: cartData } = useCartQuery();
  const { mutate: clearCart } = useClearCart();
  const { currencySymbol } = useCurrencyStore();
  const { couponCode, setCouponCode } = useCartStore();
  const { mutate: validateCoupon, isPending: isValidating } = useValidateCoupon();

  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    if (couponCode) {
      setCouponInput(couponCode);
    }
  }, [couponCode]);

  const items = cartData?.data?.items || [];
  const subtotal = cartData?.data?.subtotal ?? cartData?.data?.totalAmount ?? cartData?.data?.total ?? 0;
  const discount = cartData?.data?.discount;
  const finalTotal = cartData?.data?.finalTotal ?? subtotal;

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<OrderResponseData | null>(null);

  // Receipt File & Copy State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;
    validateCoupon(couponInput.trim());
  };

  const handleRemoveCoupon = () => {
    setCouponCode(null);
    setCouponInput("");
  };

  const { mutateAsync: uploadReceipt, isPending: isUploadingReceipt } = useUploadReceipt();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const isSubmitting = isUploadingReceipt || isCreatingOrder;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "INSTAPAY",
      notes: "",
    },
  });

  const selectedMethod = watch("paymentMethod") || "INSTAPAY";
  const activeAccountInfo = PAYMENT_ACCOUNTS[selectedMethod as PaymentMethod];

  // Copy target account number / IPA to clipboard
  const handleCopyAccount = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("تم نسخ بيانات التحويل بنجاح!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Receipt File Selection Handler
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم صورة الإيصال يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم! يرجى اختيار صورة JPG أو PNG أو WEBP");
      return;
    }

    setReceiptFile(file);
    const objectUrl = URL.createObjectURL(file);
    setReceiptPreviewUrl(objectUrl);
  };

  const removeReceiptFile = () => {
    setReceiptFile(null);
    if (receiptPreviewUrl) {
      URL.revokeObjectURL(receiptPreviewUrl);
      setReceiptPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!receiptFile) {
      toast.error("يرجى رفع صورة إيصال التحويل لإتمام الطلب");
      return;
    }

    try {
      // Step 1: Upload receipt image to Cloudinary first
      const uploadRes = await uploadReceipt(receiptFile);
      if (!uploadRes.success || !uploadRes.data?.url) {
        toast.error(uploadRes.message || "حدث خطأ أثناء رفع الإيصال");
        return;
      }

      const transferProofUrl = uploadRes.data.url;

      // Step 2: Create order with transferProofUrl & senderPhone
      const response = await createOrder({
        customerName: data.fullName,
        phone: data.phone,
        governorate: data.governorate,
        address: data.address,
        paymentMethod: data.paymentMethod,
        senderPhone: data.senderPhone,
        transferProofUrl: transferProofUrl,
        notes: data.notes || undefined,
        couponCode: couponCode || undefined,
      });

      if (response.success) {
        setCreatedOrderData(response.data);
        setIsSuccess(true);
        clearCart();
        setCouponCode(null);
        toast.success("تم إرسال الطلب بنجاح! بانتظار مراجعة الإيصال من الأدمن.");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى";
      toast.error(message);
    }
  };

  // SUCCESS STATE VIEW
  if (isSuccess && createdOrderData) {
    const methodInfo = PAYMENT_ACCOUNTS[createdOrderData.paymentMethod as PaymentMethod] || activeAccountInfo;

    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-2xl w-full bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="inline-block bg-yellow-100 text-yellow-800 font-extrabold text-sm px-4 py-1.5 rounded-full mb-3">
              بانتظار تأكيد الدفع من الأدمن (Pending)
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
              تم استلام طلبك بنجاح!
            </h1>
            <p className="text-gray-600 text-base">
              رقم الطلب: <span className="font-mono font-bold text-black text-lg">#{createdOrderData.orderNumber || createdOrderData.id}</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-right space-y-3 text-sm">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500 font-medium">طريقة الدفع المختارة:</span>
              <span className="font-bold text-gray-900">{methodInfo.label}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500 font-medium">رقم/حساب المحول منه:</span>
              <span className="font-mono font-bold text-gray-900" dir="ltr">{createdOrderData.senderPhone}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500 font-medium">إجمالي المبلغ:</span>
              <span className="font-bold text-lg text-emerald-600">
                {createdOrderData.totalAmount} {currencySymbol || "ج.م"}
              </span>
            </div>
            {createdOrderData.transferProofUrl && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500 font-medium">صورة الإيصال المرفوعة:</span>
                <a
                  href={createdOrderData.transferProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
                >
                  <Receipt className="w-4 h-4" /> عرض الإيصال
                </a>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-xs sm:text-sm text-right flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              يتم حالياً مطابقة إيصال التحويل ورقم المحفظة من قبل فريق الدعم. سيتم تغيير حالة طلبك إلى <strong>مؤكد (Confirmed)</strong> وبدء تجهيزه فوراً.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href={`/track-order?orderNumber=${createdOrderData.orderNumber || createdOrderData.id}`}
              className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              تتبع الطلب <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
            <Link
              href="/shop"
              className="flex-1 bg-gray-100 text-gray-800 px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART STATE
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">
          سلة التسوق فارغة لا يمكن إتمام الطلب.
        </h1>
        <Link href="/shop" className="text-blue-600 underline font-bold">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <h1 className="text-3xl sm:text-4xl font-black mb-8">إتمام الطلب والدفع</h1>

      {/* COD Disabled Alert Notice */}
      <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-4 text-amber-900 shadow-sm">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1 text-sm sm:text-base">
          <p className="font-bold text-amber-900 mb-0.5">
            تنويه مهم: تم إيقاف خدمة الدفع عند الاستلام (COD) بالكامل.
          </p>
          <p className="text-amber-700 text-xs sm:text-sm">
            يرجى اختيار طريقة التحويل المناسبة (إنستا باي أو إحدى المحافظ الإلكترونية)، تحويل المبلغ ثم رفع صورة الإيصال ورقم المحفظة لإتمام الطلب.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Checkout Form */}
        <div className="flex-1 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Customer Delivery Details */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                <User className="w-6 h-6 text-black" /> بيانات التوصيل
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-800">
                    الاسم بالكامل *
                  </label>
                  <input
                    {...register("fullName")}
                    className={`w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none transition-all ${
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="أدخل الاسم الثلاثي أو الرباعي"
                  />
                  {errors.fullName && (
                    <span className="text-red-500 text-xs font-semibold mt-1.5 block">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-800">
                      رقم الهاتف للتواصل *
                    </label>
                    <input
                      {...register("phone")}
                      className={`w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none transition-all ${
                        errors.phone ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="01xxxxxxxxx"
                      dir="ltr"
                      style={{ textAlign: "right" }}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-xs font-semibold mt-1.5 block">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-800">
                      المحافظة *
                    </label>
                    <Controller
                      name="governorate"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <SelectTrigger dir="rtl" className={`w-full h-[58px] bg-gray-50 border rounded-xl px-4 text-base focus:ring-2 focus:ring-black outline-none transition-all ${
                            errors.governorate ? "border-red-500" : "border-gray-200"
                          }`}>
                            <SelectValue placeholder="اختر المحافظة" />
                          </SelectTrigger>
                          <SelectContent dir="rtl">
                            {EGYPT_GOVERNORATES.map((gov) => (
                              <SelectItem key={gov} value={gov}>
                                {gov}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.governorate && (
                      <span className="text-red-500 text-xs font-semibold mt-1.5 block">
                        {errors.governorate.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-800">
                    العنوان التفصيلي *
                  </label>
                  <textarea
                    {...register("address")}
                    className={`w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none transition-all min-h-[90px] resize-y ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="اسم المنطقة، الشارع، رقم العمارة، رقم الدور أو الشقة"
                  />
                  {errors.address && (
                    <span className="text-red-500 text-xs font-semibold mt-1.5 block">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-800">
                    ملاحظات إضافية (اختياري)
                  </label>
                  <textarea
                    {...register("notes")}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all min-h-[70px]"
                    placeholder="أي موعد مفضل للتسليم أو توجيهات للمندوب"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Payment Method & Receiving Account */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold pb-4 border-b border-gray-100 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-black" /> اختر طريقة التحويل
              </h2>

              {/* Creative 2-Card Payment Method Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1: InstaPay */}
                <div
                  onClick={() => setValue("paymentMethod", "INSTAPAY", { shouldValidate: true })}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedMethod === "INSTAPAY"
                      ? "border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-600/20"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === "INSTAPAY" ? "border-purple-600 bg-purple-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "INSTAPAY" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 mb-1">إنستا باي (InstaPay)</h3>
                    <p className="text-xs text-gray-500 font-medium">تحويل لحظي مباشر عبر تطبيق InstaPay (IPA)</p>
                  </div>
                </div>

                {/* Card 2: E-Wallet */}
                <div
                  onClick={() => {
                    if (selectedMethod === "INSTAPAY") {
                      setValue("paymentMethod", "VODAFONE_CASH", { shouldValidate: true });
                    }
                  }}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedMethod !== "INSTAPAY"
                      ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20"
                      : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod !== "INSTAPAY" ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {selectedMethod !== "INSTAPAY" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 mb-1">المحفظة الإلكترونية</h3>
                    <p className="text-xs text-gray-500 font-medium">(فودافون كاش، أورنج كاش، اتصالات، WE Pay)</p>
                  </div>
                </div>
              </div>

              {/* Wallet Provider Sub-Pills Selection (Displayed when E-Wallet is active) */}
              {selectedMethod !== "INSTAPAY" && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="text-xs font-extrabold text-gray-600 block">
                    اختر نوع المحفظة الإلكترونية الخاصة بك:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { method: "VODAFONE_CASH" as const, name: "فودافون كاش" },
                      { method: "ORANGE_CASH" as const, name: "أورنج كاش" },
                      { method: "ETISALAT_CASH" as const, name: "اتصالات كاش" },
                      { method: "WE_PAY" as const, name: "وي باي (WE Pay)" },
                    ].map((w) => {
                      const isSubSelected = selectedMethod === w.method;
                      return (
                        <button
                          key={w.method}
                          type="button"
                          onClick={() => setValue("paymentMethod", w.method, { shouldValidate: true })}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all active:scale-95 ${
                            isSubSelected
                              ? "bg-black text-white border-black shadow-sm"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isSubSelected ? "bg-white" : "bg-gray-400"}`} />
                          {w.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {errors.paymentMethod && (
                <span className="text-red-500 text-xs font-semibold block">
                  {errors.paymentMethod.message}
                </span>
              )}

              {/* Target Account Display Box */}
              <div className={`rounded-2xl p-6 border ${activeAccountInfo.bgColor} ${activeAccountInfo.borderColor} space-y-4 transition-all`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      {activeAccountInfo.typeLabel} للتحويل
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono tracking-wide text-gray-900 flex items-center gap-2">
                      {activeAccountInfo.value}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyAccount(activeAccountInfo.value)}
                    className="self-start sm:self-center bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gray-600" />
                        <span>{activeAccountInfo.copyButtonText}</span>
                      </>
                    )}
                  </button>
                </div>

                {activeAccountInfo.payLink && (
                  <div className="pt-3 border-t border-purple-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="text-xs text-purple-900 font-bold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>رابط التحويل المباشر لـ InstaPay:</span>
                    </div>
                    <a
                      href={activeAccountInfo.payLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
                    >
                      <span>افتح تطبيق InstaPay للتحويل</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/60 text-xs sm:text-sm text-gray-700 space-y-2">
                  <p className="font-bold text-gray-900">خطوات إتمام التحويل:</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-600">
                    <li>قم بفتح تطبيق <strong>{activeAccountInfo.label}</strong> على هاتفك.</li>
                    <li>حول المبلغ الإجمالي <strong>({finalTotal} {currencySymbol || "ج.م"})</strong> إلى الـ {activeAccountInfo.typeLabel} أعلاه.</li>
                    <li>احفظ صورة الإيصال / لقطة الشاشة (Screenshot) وتأكد من وضوح رقم العملية والتاريخ.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Section 3: Receipt Upload & Sender Phone */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold pb-4 border-b border-gray-100 flex items-center gap-2">
                <Upload className="w-6 h-6 text-black" /> تأكيد التحويل ورقم المحفظة
              </h2>

              {/* Sender Phone Field */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-800">
                  رقم المحفظة / الهاتف المحول منه *
                </label>
                <input
                  {...register("senderPhone")}
                  className={`w-full p-4 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-black outline-none transition-all ${
                    errors.senderPhone ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="أدخل رقم المحفظة أو الحساب الذي قمت بالتحويل منه (مثال: 01012345678)"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
                {errors.senderPhone && (
                  <span className="text-red-500 text-xs font-semibold mt-1.5 block">
                    {errors.senderPhone.message}
                  </span>
                )}
                <span className="text-xs text-gray-400 mt-1 block">
                  يستخدم هذا الرقم لمطابقة العملية مع الإيصال ومراجعتها بواسطة الأدمن.
                </span>
              </div>

              {/* Receipt File Upload Dropzone */}
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-800">
                  صورة إيصال التحويل / لقطة الشاشة *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleReceiptChange}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  id="receipt-upload-input"
                />

                {!receiptFile ? (
                  <label
                    htmlFor="receipt-upload-input"
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 hover:border-black rounded-2xl bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-all text-center group"
                  >
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <FileImage className="w-7 h-7 text-gray-500 group-hover:text-black transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm sm:text-base mb-1">
                      اضغط هنا لرفع صورة الإيصال أو سحب الصورة
                    </span>
                    <span className="text-xs text-gray-400">
                      يدعم صيغ (JPG, PNG, WEBP) بحد أقصى 5 ميجابايت
                    </span>
                  </label>
                ) : (
                  <div className="relative bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
                    {receiptPreviewUrl && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        <Image
                          src={receiptPreviewUrl}
                          alt="إيصال التحويل"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {receiptFile.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {(receiptFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <Check className="w-3.5 h-3.5" /> جاهز للرفع عند التأكيد
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={removeReceiptFile}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="حذف الصورة"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 bg-black text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>
                    {isUploadingReceipt
                      ? "جاري رفع صورة الإيصال..."
                      : "جاري تأكيد وإرسال الطلب..."}
                  </span>
                </>
              ) : (
                <>
                  <span>تأكيد وإرسال الطلب</span>
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-200">
              المنتجات في طلبك ({items.length})
            </h2>

            <div className="space-y-4 mb-6 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-gray-100 flex-shrink-0 overflow-hidden shadow-sm">
                    <Image
                      src={
                        item.variant?.imageUrl ||
                        item.product?.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80"
                      }
                      alt={item.product?.name || "صورة المنتج"}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-1 text-gray-900">
                      {item.product?.name}
                    </h3>
                    {item.variant?.options && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.variant.options
                          .map(
                            (opt: any) =>
                              opt.productAttributeValue?.attributeValue?.value
                          )
                          .join(" - ")}
                      </p>
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
                    {item.lens && (
                      <div className="text-[10px] text-accent font-medium mt-1 bg-accent/5 inline-block px-1.5 py-0.5 rounded-md">
                        + {item.lens.name} {item.lensMaterial ? `(${item.lensMaterial.name})` : ""}
                      </div>
                    )}
                    <p className="text-gray-900 font-bold text-sm mt-1">
                      {item.price ??
                        item.total ??
                        item.totalPrice ??
                        item.variant?.price ??
                        item.product?.price}{" "}
                      {currencySymbol || "ج.م"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200 text-sm font-medium text-gray-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-gray-900">
                  {subtotal} {currencySymbol || "ج.م"}
                </span>
              </div>
              
              {discount && (
                <div className="flex justify-between items-center text-green-600">
                  <div className="flex flex-col">
                    <span className="font-bold">خصم ({discount.title})</span>
                    {discount.couponCode && <span className="text-xs">{discount.couponCode}</span>}
                  </div>
                  <span className="font-bold font-mono">- {discount.amount} {currencySymbol || "ج.م"}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>الشحن</span>
                <span className="text-gray-500">يحدد بعد التأكيد</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="mt-6 mb-2 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-gray-800">
                <Tag className="w-4 h-4 text-black" /> كود الخصم
              </h3>
              {discount && discount.source === "COUPON" ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm transition-all">
                  <div className="flex items-center gap-3 text-green-800 font-bold text-sm">
                    <span className="bg-green-100 text-green-900 px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                      {discount.couponCode}
                    </span>
                    <span className="text-green-600 text-xs sm:text-sm">تم التطبيق بنجاح</span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon}
                    type="button"
                    className="text-green-600 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="أدخل كود الخصم"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black uppercase shadow-sm transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isValidating || !couponInput.trim()}
                    className="bg-black text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 hover:shadow-md disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center min-w-[80px]"
                  >
                    {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "تطبيق"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 text-sm font-medium text-gray-600">
              <div className="flex justify-between text-black font-black text-xl">
                <span>الإجمالي المطلوب تحويله</span>
                <span className="text-emerald-600">
                  {finalTotal} {currencySymbol || "ج.م"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

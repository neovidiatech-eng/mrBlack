"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Package,
  Heart,
  Settings,
  Phone,
  Camera,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrderHistory } from "@/hooks/useOrder";
import { getAccessToken } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// At least 8 characters, at least one letter and one number
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .regex(emailRegex, "صيغة البريد الإلكتروني غير صحيحة"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .regex(
      passwordRegex,
      "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم",
    ),
  name: z.string().optional(),
  phone: z.string().optional(),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1, "الاسم مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
});

type FormValues = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
};

function OrderItemDetail({ item, currencySymbol }: { item: any, currencySymbol: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['productById', item.productId],
    queryFn: async () => {
      const res = await api.get(`/products/${item.productId}`);
      return res.data;
    },
    enabled: !!item.productId
  });

  const product = data?.data;
  const productName = product?.name || item.snapshot?.name || item.productName || "منتج غير معروف";
  const productPrice = item.unitPrice || item.price || 0;
  const productImg = product?.images?.[0]?.url || "/images/placeholder.png";
  
  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl mb-2 border border-gray-100 shadow-sm">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : (
          <img src={productImg} alt={productName} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{productName}</h4>
        {item.snapshot?.brand && <p className="text-xs text-gray-500 mt-1">{item.snapshot.brand}</p>}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">الكمية: {item.quantity}</span>
          <span className="font-bold text-sm text-[#c21913]">{productPrice} {currencySymbol}</span>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();
  const { currencySymbol } = useCurrencyStore();

  const {
    register: registerAuth,
    isRegistering,
    login,
    isLoggingIn,
    logout,
    user,
    isLoadingUser,
  } = useAuth();

  const { data: orderHistory, isLoading: isLoadingOrders } = useOrderHistory(1, 50, isLoggedIn);
  const orders = orderHistory?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormValues>({
    resolver: zodResolver(isLoginView ? loginSchema : registerSchema) as any,
    mode: "onTouched",
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Check if token exists on mount
    const token = getAccessToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const onSubmit = async (data: FormValues) => {
    setErrorMsg("");

    try {
      if (isLoginView) {
        const res = await login({
          email: data.email,
          password: data.password,
        });
        if (res.success) {
          setIsLoggedIn(true);
        } else {
          setErrorMsg(res.message || "فشل تسجيل الدخول");
        }
      } else {
        const formData = new FormData();
        formData.append("name", data.name || "");
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("phone", data.phone || "");
        if (avatarFile) {
          formData.append("avatar", avatarFile);
        }

        // @ts-ignore - registerAuth takes FormData now
        const res = await registerAuth(formData);
        if (res.success) {
          router.push(`/account/verify?email=${data.email}`);
        } else {
          setErrorMsg(res.message || "فشل إنشاء الحساب");
        }
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.error?.isVerified === false) {
        router.push(`/account/verify?email=${data.email}`);
        return;
      }
      
      setErrorMsg(
        err.response?.data?.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      );
    }
  };

  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar / Profile Card */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-black text-white rounded-[2rem] p-8 flex flex-col items-center text-center shadow-xl mb-6 relative overflow-hidden">
               {/* Decorative background circle */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#c21913]/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
               
               <div className="relative z-10 w-28 h-28 bg-white/10 p-1 rounded-full flex items-center justify-center mb-5 backdrop-blur-sm border border-white/10">
                 <div className="w-full h-full rounded-full overflow-hidden bg-white text-black flex items-center justify-center">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12" />
                    )}
                 </div>
               </div>
               
               {isLoadingUser ? (
                  <div className="animate-pulse flex flex-col items-center w-full z-10">
                    <div className="h-6 bg-white/20 rounded w-32 mb-3"></div>
                    <div className="h-4 bg-white/20 rounded w-40 mb-4"></div>
                  </div>
               ) : (
                  <div className="relative z-10 w-full">
                    <h2 className="font-black text-2xl mb-2">{user?.name || "المستخدم"}</h2>
                    <p className="text-gray-400 text-sm mb-1" dir="ltr">{user?.email}</p>
                    <p className="text-gray-400 text-sm mb-4" dir="ltr">{user?.phone}</p>
                    {user?.createdAt && (
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs text-gray-300 font-medium mb-6">
                        عضو منذ {new Date(user.createdAt).getFullYear()}
                      </div>
                    )}
                  </div>
               )}
               
               <button
                  onClick={logout}
                  className="relative z-10 w-full py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#c21913] hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </button>
            </div>

            <nav className="flex flex-col gap-3">
              <button className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-2xl font-bold text-black relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c21913]"></div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#c21913]/10 transition-colors">
                  <Package className="w-5 h-5 text-[#c21913]" />
                </div>
                طلباتي
              </button>
              <Link href="/account/favorites" className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-2xl font-bold text-gray-500 hover:text-black transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <Heart className="w-5 h-5" />
                </div>
                المفضلة
              </Link>
              <Link href="/account/settings" className="flex items-center gap-4 p-5 bg-white border border-gray-100 shadow-sm rounded-2xl font-bold text-gray-500 hover:text-black transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5" />
                </div>
                إعدادات الحساب
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                 <h1 className="text-2xl font-black">أحدث الطلبات</h1>
                 <span className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                   {orders.length} طلبات
                 </span>
              </div>
              
              {isLoadingOrders ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c21913]"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {orders.map((order: any) => (
                    <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      {/* Accent strip */}
                      <div className="absolute top-0 right-0 left-0 h-1 bg-gray-50">
                         {order.status === 'delivered' && <div className="h-full bg-green-500 w-full" />}
                         {order.status === 'shipped' && <div className="h-full bg-blue-500 w-full" />}
                         {order.status === 'pending' && <div className="h-full bg-yellow-500 w-full" />}
                      </div>

                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-2">
                        <div>
                          <p className="text-xs text-gray-400 mb-1 font-medium">رقم الطلب</p>
                          <p className="font-bold text-gray-900 font-mono text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{order.orderNumber}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                           <div className="text-right">
                             <p className="text-xs text-gray-400 mb-1 font-medium">التاريخ</p>
                             <p className="font-bold text-gray-900 text-sm">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                           </div>
                           <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                           <div className="text-right">
                             <p className="text-xs text-gray-400 mb-1 font-medium">الإجمالي</p>
                             <p className="font-black text-lg text-[#c21913]">{order.totalAmount} {currencySymbol}</p>
                           </div>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="mb-6 pb-6 border-b border-gray-50">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            order.status === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                            order.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                            order.status === 'returned' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                            order.status === 'refunded' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                            'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></div>
                            {order.status === 'pending' ? 'قيد المراجعة' :
                             order.status === 'processing' ? 'جاري التجهيز' :
                             order.status === 'shipped' ? 'تم الشحن' :
                             order.status === 'delivered' ? 'تم التوصيل' :
                             order.status === 'completed' ? 'مكتمل' :
                             order.status === 'cancelled' ? 'ملغي' :
                             order.status === 'returned' ? 'مسترجع' :
                             order.status === 'refunded' ? 'تم الاسترداد' :
                             order.status}
                          </span>
                      </div>
                      
                      {/* Items */}
                      <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-50">
                        <p className="text-sm font-bold mb-4 text-gray-900 flex items-center gap-2">
                           <Package className="w-4 h-4 text-gray-400" />
                           محتويات الطلب ({order.items.length})
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                           {order.items.map((item: any, idx: number) => (
                             <OrderItemDetail key={idx} item={item} currencySymbol={currencySymbol} />
                           ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">لا توجد طلبات سابقة</h3>
                  <p className="text-gray-500 mb-8 max-w-md">
                    لم تقم بإجراء أي طلبات حتى الآن. استكشف أحدث تشكيلاتنا وابدأ رحلة التسوق الفاخرة.
                  </p>
                  <Link
                    href="/shop"
                    className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-[#c21913] transition-colors shadow-lg"
                  >
                    تصفح المتجر الآن
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] relative">
        {/* Left Panel (Image & Branding) */}
        <div className="hidden md:flex w-1/2 relative bg-black text-white p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/luxury_sneaker_black_1784035395401.jpg" 
              alt="MR.BLACK Luxury" 
              className="w-full h-full object-cover opacity-50" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
               <span className="font-black text-3xl tracking-widest text-white">MR.BLACK</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6 mt-16">
              بوابتك لعالم<br />الفخامة والأناقة
            </h1>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              انضم إلى نخبة عملاء MR.BLACK واستمتع بتجربة تسوق فريدة لأرقى الأحذية العصرية والكلاسيكية.
            </p>
          </div>
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c21913]"></div>
                <p className="text-sm font-medium text-gray-300">تشكيلات حصرية ومتجددة</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c21913]"></div>
                <p className="text-sm font-medium text-gray-300">جودة إيطالية فاخرة</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#c21913]"></div>
                <p className="text-sm font-medium text-gray-300">تجربة تسوق سلسة وآمنة</p>
             </div>
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-10 w-full max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => {
                setIsLoginView(true);
                setErrorMsg("");
                reset();
                clearErrors();
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                isLoginView ? "bg-white text-black shadow-md" : "text-gray-500 hover:text-black"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginView(false);
                setErrorMsg("");
                reset();
                clearErrors();
              }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                !isLoginView ? "bg-white text-black shadow-md" : "text-gray-500 hover:text-black"
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          <div className="text-center mb-10">
             <h2 className="text-3xl font-black mb-3">
               {isLoginView ? "تسجيل الدخول" : "إنشاء حساب"}
             </h2>
             <p className="text-gray-500 text-sm">
               {isLoginView ? "مرحباً بك مجدداً في MR.BLACK" : "انضم إلينا وابدأ رحلة التسوق"}
             </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {!isLoginView && (
              <>
                 <div className="flex flex-col items-center mb-2">
                  <label className="relative cursor-pointer group">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-black transition-colors">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarFile(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500 mt-2 font-medium">الصورة الشخصية (اختياري)</span>
                </div>

                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="الاسم الكامل"
                    className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all text-sm"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs px-2 mt-1 block">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="رقم الهاتف"
                    className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all text-sm"
                    dir="ltr"
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs px-2 mt-1 block">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register("email")}
                placeholder="البريد الإلكتروني"
                className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all text-sm"
                dir="ltr"
              />
              {errors.email && (
                <span className="text-red-500 text-xs px-2 mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register("password")}
                placeholder="كلمة المرور"
                className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all text-sm"
                dir="ltr"
              />
              {errors.password && (
                <span className="text-red-500 text-xs px-2 mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            {isLoginView && (
              <div className="flex justify-end mt-[-4px]">
                <Link
                  href="/account/forgot-password"
                  className="text-xs font-bold text-gray-500 hover:text-black transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || isRegistering}
              className="w-full bg-black text-white font-bold text-base rounded-2xl py-4 mt-4 hover:bg-[#c21913] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isLoggingIn || isRegistering) && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoginView ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

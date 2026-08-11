"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, ShieldCheck, Mail, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

const schema = z.object({
  newPassword: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .regex(
      passwordRegex,
      "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم"
    ),
});

type FormValues = {
  newPassword: string;
};

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const { resetPassword, isResetPassLoading } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (!email) {
      toast.error("البريد الإلكتروني مفقود، يرجى المحاولة مرة أخرى.");
      router.push("/account/forgot-password");
    }
  }, [email, router]);

  const onSubmit = async (data: FormValues) => {
    setErrorMsg("");
    if (otp.length !== 6) {
      setErrorMsg("يرجى إدخال الرمز المكون من 6 أرقام بالكامل.");
      return;
    }
    
    try {
      const res = await resetPassword({
        email,
        otp,
        newPassword: data.newPassword,
      });
      
      if (res.success) {
        router.push("/account");
      } else {
        setErrorMsg(res.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور.");
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "الرمز المدخل غير صحيح أو منتهي الصلاحية."
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 relative">
          <ShieldCheck className="w-10 h-10 text-accent relative z-10" />
          <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-25"></div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3 text-center">إعادة تعيين كلمة المرور</h1>
        <p className="text-gray-500 text-center flex flex-col items-center gap-2">
          <span>أدخل الرمز الذي أرسلناه إلى بريدك</span>
          <span className="font-semibold text-black flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-full text-sm">
            <Mail className="w-4 h-4 text-accent" />
            {email}
          </span>
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
        <div className="flex flex-col items-center gap-4" dir="ltr">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={isResetPassLoading}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="w-14 h-16 text-2xl font-bold bg-gray-50 border-gray-200 rounded-xl" />
              <InputOTPSlot index={1} className="w-14 h-16 text-2xl font-bold bg-gray-50 border-gray-200 rounded-xl" />
              <InputOTPSlot index={2} className="w-14 h-16 text-2xl font-bold bg-gray-50 border-gray-200 rounded-xl" />
              <InputOTPSlot index={3} className="w-14 h-16 text-2xl font-bold bg-gray-50 border-gray-200 rounded-xl" />
              <InputOTPSlot index={4} className="w-14 h-16 text-2xl font-bold bg-gray-50 border-gray-200 rounded-xl" />
              <InputOTPSlot index={5} className="w-14 h-16 text-2xl font-bold bg-gray-50 border-gray-200 rounded-xl" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="relative mt-4">
          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            {...register("newPassword")}
            placeholder="كلمة المرور الجديدة"
            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all"
            dir="ltr"
            disabled={isResetPassLoading}
          />
          {errors.newPassword && (
            <span className="text-red-500 text-xs px-2 mt-1 block">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isResetPassLoading || otp.length !== 6}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed group mt-6"
        >
          {isResetPassLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              تأكيد وتغيير كلمة المرور
              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
         <Link href="/account" className="text-sm font-bold text-gray-500 hover:text-black flex items-center justify-center gap-2 transition-colors">
            <ArrowRight className="w-4 h-4" />
            العودة لتسجيل الدخول
         </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50/50">
      <Suspense fallback={<div className="w-10 h-10 border-4 border-gray-200 border-t-accent rounded-full animate-spin mx-auto" />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}

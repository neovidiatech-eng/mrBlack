"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { saveTokens } from "@/lib/axios";
import { toast } from "react-toastify";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CheckCircle2, Loader2, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("البريد الإلكتروني مفقود، يرجى التسجيل مرة أخرى.");
      router.push("/account/register");
    }
  }, [email, router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const verifyMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) => authService.verifyOTPService(data),
    onSuccess: async (data) => {
      if (data.success && data.data) {
        if (data.data.accessToken && data.data.refreshToken) {
          saveTokens(data.data.accessToken, data.data.refreshToken);
        }
        
        toast.success("تم تفعيل حسابك بنجاح!");
        // Force full reload to update auth state across the app
        window.location.href = "/account";
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "رمز التحقق غير صحيح أو منتهي الصلاحية.");
      setOtp("");
    },
  });

  const resendMutation = useMutation({
    mutationFn: (data: { email: string }) => authService.resendOTPService(data),
    onSuccess: () => {
      toast.success("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.");
      setTimeLeft(60);
      setCanResend(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إرسال الرمز الجديد.");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("يرجى إدخال الرمز المكون من 6 أرقام بالكامل.");
      return;
    }
    verifyMutation.mutate({ email, otp });
  };

  const handleResend = () => {
    if (canResend) {
      resendMutation.mutate({ email });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 relative">
          <ShieldCheck className="w-10 h-10 text-accent relative z-10" />
          <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-25"></div>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3 text-center">تفعيل الحساب</h1>
        <p className="text-gray-500 text-center flex flex-col items-center gap-2">
          <span>لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني</span>
          <span className="font-semibold text-black flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-full text-sm">
            <Mail className="w-4 h-4 text-accent" />
            {email}
          </span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8" dir="ltr">
        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={verifyMutation.isPending}
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

        <button
          type="submit"
          disabled={verifyMutation.isPending || otp.length !== 6}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed group"
          dir="rtl"
        >
          {verifyMutation.isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              تأكيد الرمز
              <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm mb-3">لم يصلك الرمز؟</p>
        <button
          onClick={handleResend}
          disabled={!canResend || resendMutation.isPending}
          className={`font-bold text-sm transition-colors ${
            canResend 
              ? "text-accent hover:text-black" 
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {resendMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...
            </span>
          ) : canResend ? (
            "إعادة إرسال الرمز"
          ) : (
            `إعادة الإرسال متاحة بعد ${timeLeft} ثانية`
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
         <Link href="/account/login" className="text-sm font-bold text-gray-500 hover:text-black flex items-center justify-center gap-2 transition-colors">
            <ArrowRight className="w-4 h-4" />
            العودة لتسجيل الدخول
         </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50/50">
      <Suspense fallback={<div className="w-10 h-10 border-4 border-gray-200 border-t-accent rounded-full animate-spin mx-auto" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const schema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .regex(emailRegex, "صيغة البريد الإلكتروني غير صحيحة"),
});

type FormValues = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isForgotPassLoading } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg("");
    try {
      const res = await forgotPassword({ email: data.email });
      if (res.success) {
        router.push(`/account/reset-password?email=${data.email}`);
      } else {
        setErrorMsg(res.message || "حدث خطأ أثناء إرسال رمز الاستعادة.");
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "حدث خطأ ما. يرجى المحاولة مرة أخرى."
      );
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-[40px] p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-gray-500 text-sm">
            أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور الخاصة بك.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="البريد الإلكتروني"
              className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-2xl py-4 pr-12 pl-4 outline-none transition-all"
              dir="ltr"
            />
            {errors.email && (
              <span className="text-red-500 text-xs px-2 mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isForgotPassLoading}
            className="w-full bg-black text-white font-bold text-lg rounded-2xl py-4 mt-2 hover:bg-gray-900 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isForgotPassLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
            ) : (
              "إرسال رمز الاستعادة"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/account"
            className="text-sm font-bold text-gray-500 hover:text-black flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

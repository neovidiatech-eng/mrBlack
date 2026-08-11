import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { saveTokens, clearTokens, getAccessToken } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: authService.getMeService,
    enabled: !!getAccessToken(), // Only fetch if we have a token
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: authService.registerService,
    onSuccess: (data) => {
      if (data.success) {
        // Tokens are no longer returned here, user must verify OTP
        toast.success("تم إنشاء الحساب بنجاح! يرجى مراجعة بريدك الإلكتروني.");
      } else {
        toast.error(data.message || "فشل إنشاء الحساب");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب");
    }
  });

  const loginMutation = useMutation({
    mutationFn: authService.loginService,
    onSuccess: (data) => {
      if (data.success && data.data?.accessToken && data.data?.refreshToken) {
        saveTokens(data.data.accessToken, data.data.refreshToken);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        toast.success("تم تسجيل الدخول بنجاح!");
      } else {
        toast.error(data.message || "فشل تسجيل الدخول");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    }
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPasswordService,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "تم إرسال رمز استعادة كلمة المرور إلى بريدك الإلكتروني.");
      } else {
        toast.error(data.message || "حدث خطأ أثناء إرسال رمز استعادة كلمة المرور.");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إرسال طلب استعادة كلمة المرور.");
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPasswordService,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "تم إعادة تعيين كلمة المرور بنجاح.");
      } else {
        toast.error(data.message || "فشل إعادة تعيين كلمة المرور.");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور.");
    }
  });

  const logout = async () => {
    try {
      await authService.logoutService();
      toast.info("تم تسجيل الخروج");
    } catch (error) {
      console.error("Logout request failed", error);
    } finally {
      clearTokens();
      queryClient.clear();
      // Use window.location.href to fully reload and clear states
      window.location.href = "/account";
    }
  };

  return {
    user: userQuery.data?.data,
    isLoadingUser: userQuery.isLoading,
    isUserError: userQuery.isError,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotPassLoading: forgotPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutateAsync,
    isResetPassLoading: resetPasswordMutation.isPending,

    logout,
  };
};

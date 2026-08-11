import api, { ApiResponse, AuthResponseData, User } from "@/lib/axios";

export const authService = {
  registerService: async (data: FormData) => {
    const response = await api.post<ApiResponse<AuthResponseData>>(
      "/auth/register",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  verifyOTPService: async (data: { email: string; otp: string }) => {
    const response = await api.post<ApiResponse<AuthResponseData>>(
      "/auth/verify-otp",
      data
    );
    return response.data;
  },

  resendOTPService: async (data: { email: string }) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/resend-otp",
      data
    );
    return response.data;
  },

  forgotPasswordService: async (data: { email: string }) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  },

  resetPasswordService: async (data: { email: string; otp: string; newPassword: string }) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/reset-password",
      data
    );
    return response.data;
  },

  loginService: async (data: Record<string, string>) => {
    const response = await api.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  refreshService: async (refreshToken: string) => {
    const response = await api.post<ApiResponse<AuthResponseData>>(
      "/auth/refresh",
      { refreshToken },
    );
    return response.data;
  },

  logoutService: async () => {
    const response = await api.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },

  getMeService: async () => {
    const response = await api.get<ApiResponse<User>>("/users/me");
    return response.data;
  },
};

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { useCurrencyStore } from "@/store/useCurrencyStore";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  currencyCode?: string;
  currencySymbol?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl?: string;
  createdAt?: string;
  prescriptionImage?: string | null;
}

export interface AuthResponseData {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

// ─── Token Helpers ────────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ─── Axios Instance ───────────────────────────────────────────────────────────

// Adjust the base URL as needed based on the environment
const api: AxiosInstance = axios.create({
  baseURL: "https://api.mrblack-eg.com/api/v1/public", // the common base for auth endpoints
  timeout: 300000,
});

const isAdminRequest = (config?: { baseURL?: string; url?: string }) => {
  const baseURL = config?.baseURL || "";
  const url = config?.url || "";
  const fullUrl = `${baseURL}/${url}`.replace(/([^:]\/)\/+/g, "$1");

  return (
    url.startsWith("/admin") ||
    url.startsWith("admin") ||
    fullUrl.includes("/api/v1/admin/")
  );
};

const syncCurrencyFromResponse = (response: AxiosResponse) => {
  if (typeof window === "undefined" || isAdminRequest(response.config)) return;

  const payload = response.data as {
    currencyCode?: unknown;
    currencySymbol?: unknown;
    data?: {
      currencyCode?: unknown;
      currencySymbol?: unknown;
    };
  };
  const currencyCode = payload?.currencyCode ?? payload?.data?.currencyCode;
  const currencySymbol =
    payload?.currencySymbol ?? payload?.data?.currencySymbol;

  if (typeof currencyCode !== "string" || typeof currencySymbol !== "string") {
    return;
  }

  const currentCurrency = useCurrencyStore.getState();
  const requestedCurrency = response.config.headers?.["x-currency"];
  if (!requestedCurrency && currentCurrency.currencyCode) return;

  if (
    currentCurrency.currencyCode !== currencyCode ||
    currentCurrency.currencySymbol !== currencySymbol
  ) {
    useCurrencyStore.getState().setCurrency(currencyCode, currencySymbol);
  }
};

// ─── Request Interceptor ──────────────────────────────────────────────────────

import { getGuestId } from "./guest";

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
      const guestId = getGuestId();
      if (guestId) {
        config.headers["x-guest-id"] = guestId;
      }
    }

    // Send currency only after the backend or the user has selected one.
    if (
      typeof window !== "undefined" &&
      config.headers &&
      !isAdminRequest(config)
    ) {
      try {
        const currencyStorage = localStorage.getItem("optical_currency");
        if (currencyStorage) {
          const parsed = JSON.parse(currencyStorage);
          if (parsed?.state?.currencyCode) {
            config.headers["x-currency"] = parsed.state.currencyCode;
          }
        }
      } catch (e) {
        console.error("Error parsing currency from local storage", e);
      }
    } else if (config.headers) {
      delete config.headers["x-currency"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const errorTranslations: Record<string, string> = {
  "jwt expired": "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.",
  "jwt malformed": "جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى.",
  "Not authorized to access this route": "غير مصرح لك بالوصول إلى هذا المورد.",
  "Invalid credentials": "بيانات الدخول غير صحيحة.",
  "User not found": "المستخدم غير موجود.",
  "No token provided": "يرجى تسجيل الدخول أولاً.",
  "Duplicate field value": "هذه البيانات موجودة مسبقاً.",
  "Validation Error": "خطأ في البيانات المدخلة.",
  "Please verify your email first.": "يرجى تفعيل حسابك أولاً.",
};

const translateError = (msg?: string) => {
  if (!msg) return "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.";

  // Check exact matches
  if (errorTranslations[msg]) return errorTranslations[msg];

  // Check partial matches
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (msg.includes(key)) {
      return value;
    }
  }

  // If it's English (has alphabetic characters), give a generic error or return as is?
  // User said "اي مسدج تظهر فالtoast تكون عربي حتي لو جايه من الapi غير كدا خليها عربي"
  // Meaning if it's not translated and it's english, translate it to a generic arabic error.
  const isEnglish = /[a-zA-Z]/.test(msg);
  if (isEnglish) {
    return "حدث خطأ في الخادم، يرجى المحاولة لاحقاً.";
  }

  return msg;
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    syncCurrencyFromResponse(response);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("auth/login") &&
      !originalRequest.url?.includes("auth/register")
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<ApiResponse<AuthResponseData>>(
          "https://api.mrblack-eg.com/api/v1/public/auth/refresh",
          { refreshToken },
        );

        if (data.success && data.data?.accessToken && data.data?.refreshToken) {
          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          saveTokens(newAccessToken, newRefreshToken);
          api.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error("Failed to refresh token");
        }
      } catch (err) {
        processQueue(err, null);
        clearTokens();

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data) {
      const apiResponse = error.response.data as ApiResponse<any>;
      if (apiResponse.message) {
        apiResponse.message = translateError(apiResponse.message);
      }
    }

    // Also update error.message for generic axios errors
    if (error.message && /[a-zA-Z]/.test(error.message) && !error.response) {
      error.message = translateError(error.message);
    }

    return Promise.reject(error);
  },
);

export default api;

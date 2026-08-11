import api, { ApiResponse, User } from "@/lib/axios";

export const userService = {
  getProfileService: async () => {
    const response = await api.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  updateProfileService: async (data: FormData) => {
    const response = await api.put<ApiResponse<User>>("/users/me", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteAccountService: async () => {
    const response = await api.delete<ApiResponse<null>>("/users/me");
    return response.data;
  },
};

import api from "@/lib/axios";
import { NotificationResponse } from "@/types/notifications";
import { ApiResponse } from "@/lib/axios";

export const notificationsService = {
  getNotifications: async (unreadOnly?: boolean) => {
    const params = unreadOnly ? { unreadOnly: true } : {};
    const response = await api.get<NotificationResponse>("/notifications", { params });
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch<ApiResponse<null>>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch<ApiResponse<null>>("/notifications/read-all");
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
    return response.data;
  }
};

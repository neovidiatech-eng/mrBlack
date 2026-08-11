import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";
import { toast } from "react-toastify";
import { getAccessToken } from "@/lib/axios";
export function useNotifications(unreadOnly?: boolean) {
  const queryClient = useQueryClient();
  const queryKey = ["notifications", unreadOnly];
  const token = getAccessToken();

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => notificationsService.getNotifications(unreadOnly),
    enabled: !!token,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث الإشعار.");
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث الإشعارات.");
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationsService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "حدث خطأ أثناء الحذف.");
    }
  });

  return {
    notifications: data?.data || [],
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    deleteNotification: deleteNotificationMutation.mutate,
    isDeleting: deleteNotificationMutation.isPending,
  };
}

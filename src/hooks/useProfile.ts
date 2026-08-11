import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { getAccessToken, clearTokens } from "@/lib/axios";
import { toast } from "react-toastify";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["authUserProfile"],
    queryFn: userService.getProfileService,
    enabled: !!getAccessToken(),
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfileService,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["authUserProfile"] });
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        toast.success("تم تحديث البيانات بنجاح");
      } else {
        toast.error(data.message || "فشل تحديث البيانات");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء تحديث البيانات");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: userService.deleteAccountService,
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      toast.info("تم حذف الحساب بنجاح");
      window.location.href = "/account";
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء حذف الحساب");
    },
  });

  return {
    profile: profileQuery.data?.data,
    isLoadingProfile: profileQuery.isLoading,
    isProfileError: profileQuery.isError,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
    deleteAccountError: deleteAccountMutation.error,
  };
};

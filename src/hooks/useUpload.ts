import { useMutation } from "@tanstack/react-query";
import { uploadService } from "@/services/upload.service";
import { toast } from "react-toastify";

export const useUploadPrescription = () => {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadPrescription(file),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء رفع الصورة");
    },
  });
};

export const useUploadReceipt = () => {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadReceipt(file),
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء رفع صورة الإيصال"
      );
    },
  });
};


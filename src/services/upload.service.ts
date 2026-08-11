import api, { ApiResponse } from "@/lib/axios";
import { UploadReceiptResponseData } from "@/types/order";

export const uploadService = {
  uploadPrescription: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<{
      success: boolean;
      message: string;
      data: { imageUrl: string };
    }>("/upload/prescription", formData);
    return response.data;
  },

  uploadReceipt: async (file: File) => {
    const formData = new FormData();
    formData.append("receipt", file);

    const response = await api.post<ApiResponse<UploadReceiptResponseData>>(
      "/upload/receipt",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};


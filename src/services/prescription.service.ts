import api, { ApiResponse } from "@/lib/axios";
import { PrescriptionGroup } from "@/types/prescription";

export const prescriptionService = {
  getPrescriptions: async () => {
    const response =
      await api.get<ApiResponse<PrescriptionGroup[]>>("/prescriptions");
    return response.data;
  },
};

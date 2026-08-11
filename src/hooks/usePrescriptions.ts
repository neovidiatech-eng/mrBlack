import { useQuery } from "@tanstack/react-query";
import { prescriptionService } from "@/services/prescription.service";

export const usePrescriptionsQuery = () => {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => prescriptionService.getPrescriptions(),
  });
};

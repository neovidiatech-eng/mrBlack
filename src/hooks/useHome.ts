import { useQuery } from "@tanstack/react-query";
import { homeService } from "@/services/home.service";

export const useHomeData = () => {
  return useQuery({
    queryKey: ["home-data"],
    queryFn: () => homeService.getHomeData(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

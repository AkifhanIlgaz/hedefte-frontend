import { useQuery } from "@tanstack/react-query";
import sessionService from "../../services/sessionService";

export const useHeatmap = () => {
  return useQuery({
    queryKey: ["sessions", "heatmap"],
    queryFn: () => sessionService.getHeatmap(),
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 day
  });
};

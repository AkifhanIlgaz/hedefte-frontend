import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../features/analiz/utils";

interface UseChartDataParams {
  examType: "TYT" | "AYT";
  chartType: "general" | "all_lessons";
  timeInterval: number;
}

export function useChartData<T>({
  examType,
  chartType,
  timeInterval,
}: UseChartDataParams) {
  return useQuery<T>({
    queryKey: ["chart", examType, chartType, timeInterval],
    queryFn: () =>
      fetcher(
        `http://localhost:8080/api/analysis/charts?exam=${examType}&chartType=${chartType}&timeInterval=${timeInterval}`,
      ) as Promise<T>,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}

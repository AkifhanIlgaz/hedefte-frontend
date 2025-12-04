import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../features/analiz/utils";

interface UseChartDataParams {
  examType: "TYT" | "AYT";
  chartType: "general" | "lesson";
  lesson?: string;
  timeInterval: number;
}

export function useChartData<T>({
  examType,
  chartType,
  lesson,
  timeInterval,
}: UseChartDataParams) {
  return useQuery<T>({
    queryKey: ["chart", examType, chartType, lesson, timeInterval],
    queryFn: () =>
      fetcher(
        `analysis/charts?exam=${examType}&chartType=${chartType}&timeInterval=${timeInterval}${lesson ? `&lesson=${lesson}` : ""}`,
      ) as Promise<T>,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}

export function useTYTGeneralChart<T>(timeInterval: number) {
  return useQuery<T>({
    queryKey: ["tyt", "charts", "general", timeInterval],
    queryFn: () =>
      fetcher(`tyt/charts/general?timeInterval=${timeInterval}`) as Promise<T>,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}

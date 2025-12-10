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

  lesson,
  timeInterval,
}: UseChartDataParams) {
  return useQuery<T>({
    queryKey: ["chart", examType, lesson, timeInterval],
    queryFn: () =>
      fetcher(
        `analysis/${examType.toLowerCase()}/charts?timeInterval=${timeInterval}${lesson ? `&lesson=${lesson}` : ""}`,
      ) as Promise<T>,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}

export function useTYTLessonChart(lesson: string, timeInterval: number) {
  return useQuery({
    queryKey: ["tyt", "charts", "lesson", lesson, timeInterval],
    queryFn: () =>
      fetcher(
        `tyt/charts/lesson?timeInterval=${timeInterval}&lesson=${lesson}`,
      ) as Promise<any>,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
}

export function useTYTTopicMistakesChart(lesson: string, timeInterval: number) {
  return useQuery({
    queryKey: ["tyt", "topic-mistakes", lesson, timeInterval],
    queryFn: () =>
      fetcher(
        `tyt/topic-mistakes?timeInterval=${timeInterval}&lesson=${lesson}`,
      ) as Promise<any>,
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

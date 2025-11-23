import { useQuery } from "@tanstack/react-query";
import { Exam } from "../features/analiz/types";
import { fetcher } from "../features/analiz/utils";

interface UseExamsParams {
  exam: Exam;
  page: number;
  rowsPerPage: number;
  timeInterval: number;
}

export const useExams = ({
  exam,
  page,
  rowsPerPage,
  timeInterval,
}: UseExamsParams) => {
  return useQuery({
    queryKey: ["analysis", exam, page, rowsPerPage, timeInterval],
    queryFn: () =>
      fetcher(
        `analysis/${exam}?page=${page}&rowsPerPage=${rowsPerPage}&timeInterval=${timeInterval}`,
      ),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};

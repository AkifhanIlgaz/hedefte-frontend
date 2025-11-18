import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../features/analiz/utils";

interface UseExamsParams {
  page: number;
  rowsPerPage: number;
  timeInterval: number;
}

export const useTYTExams = ({
  page,
  rowsPerPage,
  timeInterval,
}: UseExamsParams) => {
  return useQuery({
    queryKey: ["analysis-tyt", page, rowsPerPage, timeInterval],
    queryFn: () =>
      fetcher(
        `http://localhost:8080/api/analysis/tyt?page=${page}&rowsPerPage=${rowsPerPage}&timeInterval=${timeInterval}`,
      ),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};

export const useAYTExams = ({
  page,
  rowsPerPage,
  timeInterval,
}: UseExamsParams) => {
  return useQuery({
    queryKey: ["analysis-ayt", page, rowsPerPage, timeInterval],
    queryFn: () =>
      fetcher(
        `http://localhost:8080/api/analysis/ayt?page=${page}&rowsPerPage=${rowsPerPage}&timeInterval=${timeInterval}`,
      ),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};

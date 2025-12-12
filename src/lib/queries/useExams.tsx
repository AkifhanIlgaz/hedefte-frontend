import { Exam } from "@/src/features/analiz/types";
import { useQuery } from "@tanstack/react-query";
import examService from "../services/examService";

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
    queryKey: ["exams", exam, page, rowsPerPage, timeInterval],
    queryFn: () => examService.getExams(exam, page, rowsPerPage, timeInterval),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};

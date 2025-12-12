import { useMutation } from "@tanstack/react-query";
import examService from "../services/examService";

export function useDeleteExam() {
  return useMutation({
    mutationFn: (examId: string) => examService.deleteExam(examId),
  });
}

import { Exam } from "@/src/features/analiz/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import examService from "../services/examService";

export function useDeleteExam(exam: Exam) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => examService.deleteExam(examId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["analytics", "lessons", exam],
      });
      queryClient.invalidateQueries({
        queryKey: ["analytics", "exams", exam],
      });

      queryClient.invalidateQueries({
        queryKey: ["exams", exam],
      });
    },
  });
}

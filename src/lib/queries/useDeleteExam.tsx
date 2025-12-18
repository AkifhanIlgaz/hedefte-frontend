import { Exam } from "@/src/features/analiz/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import examService from "../services/examService";

export function useDeleteExam(exam: Exam) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => examService.deleteExam(examId),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["analytics", "lessons", exam],
      });
      await queryClient.invalidateQueries({
        queryKey: ["analytics", "exams", exam],
      });

      await queryClient.invalidateQueries({
        queryKey: ["exams", exam],
      });
    },
  });
}

import { AddExamRequest } from "@/src/features/analiz/schemas/add_exam.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import examService from "../services/examService";

export function useAddExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AddExamRequest) => examService.addExam(req),
    onSuccess: async (data, variables) => {
      const { examType } = variables;

      await queryClient.invalidateQueries({
        queryKey: ["analytics", "lessons", examType],
      });

      await queryClient.invalidateQueries({
        queryKey: ["analytics", "exams", examType],
      });

      await queryClient.invalidateQueries({
        queryKey: ["exams", examType],
      });
    },
  });
}

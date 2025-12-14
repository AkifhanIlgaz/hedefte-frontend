import { AddExamRequest } from "@/src/features/analiz/schemas/add_exam.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import examService from "../services/examService";

export function useAddExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AddExamRequest) => examService.addExam(req),
    onSuccess: (data, variables) => {
      const { examType } = variables;

      queryClient.invalidateQueries({
        queryKey: ["analytics", "lessons", examType],
      });

      queryClient.invalidateQueries({
        queryKey: ["analytics", "exam", examType],
      });

      queryClient.invalidateQueries({
        queryKey: ["exams", examType],
      });
    },
  });
}

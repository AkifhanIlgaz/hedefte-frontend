import { AddExamRequest } from "@/src/features/analiz/schemas/add_exam.schema";
import { useMutation } from "@tanstack/react-query";
import examService from "../services/examService";

export function useAddExam() {
  return useMutation({
    mutationFn: (req: AddExamRequest) => examService.addExam(req),
  });
}

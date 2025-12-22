import {
  AskTopicMistakeResponse,
  Exam,
  LessonName,
} from "@/src/features/analiz/types";
import { useMutation } from "@tanstack/react-query";
import topicMistakeService from "../../services/topicMistakeService";

export default function useAskTopicMistake() {
  return useMutation<
    AskTopicMistakeResponse,
    Error,
    { exam: Exam; lesson: LessonName; imageUrl: string }
  >({
    mutationFn: ({
      exam,
      lesson,
      imageUrl,
    }: {
      exam: Exam;
      lesson: LessonName;
      imageUrl: string;
    }) => topicMistakeService.ask(exam, lesson, imageUrl),
  });
}

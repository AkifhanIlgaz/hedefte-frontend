import {
  AskTopicMistakeResponse,
  Exam,
  GeneralResponse,
  LessonName,
  TopicWrongCount,
} from "@/src/features/analiz/types";
import api from "../axios";

class TopicMistakeService {
  async getWrongCounts(
    exam: Exam,
    lesson: LessonName,
    timeInterval: number,
  ): Promise<TopicWrongCount[]> {
    const res = await api.get<GeneralResponse<TopicWrongCount[]>>(
      "/topic-mistakes",
      { params: { exam, lesson, timeInterval } },
    );

    if (!res.data.success) {
      throw new Error("Failed to fetch wrong counts");
    }

    return res.data.payload;
  }

  async ask(
    exam: Exam,
    lesson: LessonName,
    imageUrl: string,
  ): Promise<AskTopicMistakeResponse> {
    const res = await api.post<GeneralResponse<AskTopicMistakeResponse>>(
      "/topic-mistakes/ask",
      {
        exam: exam.split("_")[0],
        lesson,
        imageUrl,
      },
    );

    if (!res.data.success) {
      throw new Error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }

    return res.data.payload;
  }
}

export default new TopicMistakeService();

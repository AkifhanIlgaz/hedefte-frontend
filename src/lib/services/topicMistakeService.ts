import {
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
}

export default new TopicMistakeService();

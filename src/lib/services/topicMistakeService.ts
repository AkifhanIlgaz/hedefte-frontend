import {
  AskTopicMistakeResponse,
  Exam,
  GeneralResponse,
  LessonName,
  TopicMistake,
  TopicWrongCount,
} from "@/src/features/analiz/types";
import { GetTopicMistakesRequest } from "@/src/features/soru-bankam/schemas/get_topic_mistakes.schema";
import { SolveTopicMistakeRequest } from "@/src/features/soru-bankam/schemas/solve_topic_mistake.schema";
import api from "../axios";

class TopicMistakeService {
  async getWrongCounts(
    exam: Exam,
    lesson: LessonName,
    timeInterval: number,
  ): Promise<TopicWrongCount[]> {
    const res = await api.get<GeneralResponse<TopicWrongCount[]>>(
      "/topic-mistakes/lesson",
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

  async getTopicMistakes(
    req: GetTopicMistakesRequest,
  ): Promise<GeneralResponse<TopicMistake[]>> {
    const res = await api.get<GeneralResponse<TopicMistake[]>>(
      "/topic-mistakes",
      {
        params: {
          exam: req.exam,
          lesson: req.lesson,
          topic: req.topic,
          timeInterval: req.timeInterval,
          page: req.page,
          rowsPerPage: req.rowsPerPage,
        },
      },
    );

    if (!res.data.success) {
      throw new Error("Failed to fetch topic mistakes");
    }

    return res.data;
  }

  async solve(req: SolveTopicMistakeRequest): Promise<GeneralResponse<void>> {
    const res = await api.post<GeneralResponse<void>>(
      "/topic-mistakes/solve",
      req,
    );

    if (!res.data.success) {
      throw new Error("Failed to solve topic mistake");
    }

    return res.data;
  }

  async delete(id: string): Promise<GeneralResponse<void>> {
    const res = await api.delete<GeneralResponse<void>>(
      `/topic-mistakes/${id}`,
    );

    if (!res.data.success) {
      throw new Error("Failed to delete topic mistake");
    }

    return res.data;
  }
}

export default new TopicMistakeService();

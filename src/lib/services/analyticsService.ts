import {
  Exam,
  ExamAnalytics,
  GeneralResponse,
  LessonAnalytics,
} from "@/src/features/analiz/types";
import api from "../axios";

class AnalyticsService {
  async getExamAnalytics(
    exam: Exam,
    timeInterval: number,
  ): Promise<ExamAnalytics> {
    const res = await api.get<GeneralResponse<ExamAnalytics>>(
      "/analytics/exams",
      { params: { exam, timeInterval } },
    );

    if (!res.data.success)
      throw new Error(`sinav analizi alinamadi  : ${res.data.message}`);

    return res.data.payload;
  }

  async getLessonAnalytics(
    exam: Exam,
    timeInterval: number,
  ): Promise<LessonAnalytics[]> {
    const res = await api.get<GeneralResponse<LessonAnalytics[]>>(
      "/analytics/lessons",
      { params: { exam, timeInterval } },
    );

    if (!res.data.success)
      throw new Error(`Ders ekleme başarısız: ${res.data.message}`);

    return res.data.payload;
  }
}

export default new AnalyticsService();

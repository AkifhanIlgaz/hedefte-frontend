import { AddExamRequest } from "@/src/features/analiz/schemas/add_exam.schema";
import {
  Exam,
  ExamResponse,
  GeneralResponse,
} from "@/src/features/analiz/types";
import api from "../axios";

class ExamService {
  constructor() {}

  async addExam(req: AddExamRequest): Promise<void> {
    const lessons = Object.entries(req.lessons).map(([name, val]) => {
      val.topicMistakes = val.topicMistakes.map((mistake) => {
        return {
          ...mistake,
          date: req.date,
          examType: req.examType,
          lesson: name,
          isSolved: false,
        };
      });

      return {
        ...val,
        name: name,
      };
    });

    const res = await api.post<GeneralResponse<any>>("/exams", {
      ...req,
      lessons,
    });

    if (!res.data.success)
      throw new Error(`Deneme ekleme başarısız: ${res.data.message}`);
  }

  async getExams(
    exam: Exam,
    page: number,
    rowsPerPage: number,
    timeInterval: number,
  ): Promise<GeneralResponse<ExamResponse[]>> {
    const res = await api.get<GeneralResponse<ExamResponse[]>>(
      `/exams?exam=${exam}&page=${page}&rowsPerPage=${rowsPerPage}&timeInterval=${timeInterval}`,
    );

    if (!res.data.success)
      throw new Error(`Deneme ekleme başarısız: ${res.data.message}`);

    return res.data;
  }

  async deleteExam(id: string): Promise<void> {
    const res = await api.delete<GeneralResponse<null>>(`/exams/${id}`);

    if (!res.data.success)
      throw new Error(`Deneme silme başarısız: ${res.data.message}`);
  }
}

export default new ExamService();

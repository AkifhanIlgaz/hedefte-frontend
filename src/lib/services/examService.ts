import { AddExamRequest } from "@/src/features/analiz/schemas/add_exam.schema";
import { GeneralResponse } from "@/src/features/analiz/types";
import api from "../axios";

class ExamService {
  constructor() {}

  async addExam(req: AddExamRequest): Promise<void> {
    const lessons = Object.entries(req.lessons).map(([name, val]) => {
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
}

export default new ExamService();

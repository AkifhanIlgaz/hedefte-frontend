import { Exam } from "../analiz/types";

export interface Session {
  id: string;
  userId: string;
  exam: Exam;
  type: string;
  lesson: string;
  topic: string;
  goal: string;
  notes: string;
  date: Date | string;
  duration: number;
  isCompleted: boolean;
}

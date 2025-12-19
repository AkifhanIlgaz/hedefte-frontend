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
  questionCount?: number;
  isCompleted: boolean;
}

export interface ActivityData {
  sessions: number;
  duration: number; // minutes
  questions: number;
}

export interface Heatmap {
  data: Record<string, ActivityData>;
  currentStreak: number;
}

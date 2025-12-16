import { LucideIcon } from "lucide-react";

export type Exam = "TYT" | "AYT_SAY" | "AYT_EA";

export const TytLessonNames = [
  "Türkçe",
  "Matematik",
  "Tarih",
  "Coğrafya",
  "Felsefe",
  "Din Kültürü",
  "Fizik",
  "Kimya",
  "Biyoloji",
] as const;

export const AytEaLessonNames = ["Edebiyat", "Tarih", "Coğrafya", "Matematik"];

export const AytMfLessonNames = ["Matematik", "Fizik", "Kimya", "Biyoloji"];

export type TytLessonName = (typeof TytLessonNames)[number];

export type AytEaLessonName = (typeof AytEaLessonNames)[number];

export type AytMfLessonName = (typeof AytMfLessonNames)[number];

export type LessonName = TytLessonName | AytEaLessonName | AytMfLessonName;

export type Lesson = {
  name: LessonName;
  totalQuestions: number;
  icon: LucideIcon;
  bgClass: string;
  iconColor: string;
  topics: string[];
};

export interface TopicMistake {
  id?: string; // bson.ObjectID -> string (optional because omitempty)
  date: Date; // time.Time -> string (ISO date)
  examId: string; // bson.ObjectID -> string
  userId: string;
  examType: string;
  lesson: string;
  filePath: string;
  topic: string;
  correctAnswer: string;
  isSolved: boolean;
  imageUrl: string;
}

export interface GeneralChartPayload {
  examCount: number;
  maxNet: number;
  averageNet: number;
  exams: {
    date: string;
    name: string;
    totalNet: number;
  }[];
  lessons: Record<
    LessonName,
    {
      maxNet: number;
      averageTime: number;
      averageNet: number;
    }
  >;
}

export interface LessonChartPayload {
  examCount: number;
  maxNet: number;
  averageNet: number;
  exams: {
    date: string;
    name: string;
    totalNet: number;
  }[];
  topicMistakes: Record<string, number>;
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  payload: T;
  meta?: Metadata;
  timestamp: string;
}

export interface Metadata {
  page: number;
  rowsPerPage: number;
  total: number;
  totalPages: number;
}

export interface ExamResponse {
  id: string;
  date: string;
  name: string;
  result: number;
  lessons: LessonResponse[];
}

export type LessonResponse = {
  name: LessonName;
  correct: number;
  wrong: number;
  empty: number;
  time: number;
  result: number;
};

export type ExamAnalytics = {
  lesson: string;
  examCount: number;
  maxResult: number;
  averageResult: number;
  resultSeries: ResultSeries[];
};

export type LessonAnalytics = ExamAnalytics & {
  resultSeries: LessonResultSeries[];
  averageTime: number;
};

export type ResultSeries = {
  date: Date;
  name: string;
  result: number;
};

export type LessonResultSeries = ResultSeries & {
  time: number;
};

export type TopicWrongCount = {
  topic: string;
  count: number;
};

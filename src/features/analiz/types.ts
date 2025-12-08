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

export type TopicMistake = {
  imageUrl: string;
  filePath: string;
  topicName: string;
};

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
  timestamp: string;
}

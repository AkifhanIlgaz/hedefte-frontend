import { LucideIcon } from "lucide-react";

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

export const AytLessonNames = [
  "Edebiyat",
  "Tarih",
  "Coğrafya",
  "Matematik",
  "Fizik",
  "Kimya",
  "Biyoloji",
];

export type TytLessonName = (typeof TytLessonNames)[number];

export type AytLessonName = (typeof AytLessonNames)[number];

export type LessonName = TytLessonName | AytLessonName;

export type Lesson = {
  name: LessonName;
  totalQuestions: number;
  icon: LucideIcon;
  bgClass: string;
  iconColor: string;
  topics: string[];
};

export type TopicMistake = {
  topicName: string;
  mistakeCount: number;
};

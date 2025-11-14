import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  Earth,
  FlaskConical,
  Lightbulb,
  Swords,
  Trees,
} from "lucide-react";
import { Lesson, TytLessonName } from "./types";

export const tytLessons: Record<TytLessonName, Lesson> = {
  Türkçe: {
    name: `Türkçe`,
    totalQuestions: 40,
    icon: BookOpen,
    bgClass: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-700 dark:text-amber-300",
  },
  Tarih: {
    name: `Tarih`,
    totalQuestions: 5,
    icon: Swords,
    bgClass: "bg-rose-100 dark:bg-rose-900/20",
    iconColor: "text-rose-700 dark:text-rose-300",
  },
  Coğrafya: {
    name: "Coğrafya",
    totalQuestions: 5,
    icon: Earth,
    bgClass: "bg-sky-100 dark:bg-sky-900/20",
    iconColor: "text-sky-700 dark:text-sky-300",
  },
  Felsefe: {
    name: "Felsefe",
    totalQuestions: 5,
    icon: Lightbulb,
    bgClass: "bg-violet-100 dark:bg-violet-900/20",
    iconColor: "text-violet-700 dark:text-violet-300",
  },
  "Din Kültürü": {
    name: "Din Kültürü",
    totalQuestions: 5,
    icon: Brain,
    bgClass: "bg-emerald-100 dark:bg-emerald-900/20",
    iconColor: "text-emerald-700 dark:text-emerald-300",
  },
  Matematik: {
    name: "Matematik",
    totalQuestions: 40,
    icon: Calculator,
    bgClass: "bg-indigo-100 dark:bg-indigo-900/20",
    iconColor: "text-indigo-700 dark:text-indigo-300",
  },
  Fizik: {
    name: "Fizik",
    totalQuestions: 7,
    icon: Atom,
    bgClass: "bg-teal-100 dark:bg-teal-900/20",
    iconColor: "text-teal-700 dark:text-teal-300",
  },
  Kimya: {
    name: "Kimya",
    totalQuestions: 7,
    icon: FlaskConical,
    bgClass: "bg-lime-100 dark:bg-lime-900/20",
    iconColor: "text-lime-700 dark:text-lime-300",
  },
  Biyoloji: {
    name: "Biyoloji",
    totalQuestions: 6,
    icon: Trees,
    bgClass: "bg-fuchsia-100 dark:bg-fuchsia-900/20",
    iconColor: "text-fuchsia-700 dark:text-fuchsia-300",
  },
};

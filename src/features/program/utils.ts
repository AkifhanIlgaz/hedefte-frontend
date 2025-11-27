import { eaLessons, mfLessons, tytLessons } from "../analiz/data";
import { Exam, LessonName, TytLessonName } from "../analiz/types";

export const getBadgeColor = (type: string) => {
  switch (type) {
    case "TYT":
      return "bg-primary-100 text-primary-700 hover:bg-primary-200 border-primary-200";
    case "AYT":
      return "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 border-secondary-200";
    case "YDT":
      return "bg-accent-100 text-accent-700 hover:bg-accent-200 border-accent-200";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
  }
};

export const getLessonStyles = (lessonName: string) => {
  const allLessons = {
    ...tytLessons,
    ...eaLessons,
    ...mfLessons,
  };

  const lesson = allLessons[lessonName as keyof typeof allLessons];

  if (!lesson) {
    console.warn(`Lesson "${lessonName}" not found.`);
    return { bgClass: "bg-gray-100", iconColor: "text-gray-700" }; // Default styles
  }

  return `
    ${lesson.bgClass}
    ${lesson.iconColor}
  `;
};

export const getTopics = (exam?: Exam, lesson?: LessonName) => {
  if (!exam || !lesson) return [];
  if (exam === "TYT") return tytLessons[lesson as TytLessonName].topics;
  return { ...eaLessons, ...mfLessons }[lesson].topics;
};

import { allLessons } from "../analiz/data";
import { Exam, LessonName } from "../analiz/types";

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

export const getLessonStyles = (exam: Exam, lessonName: string) => {
  let bgClass;
  let iconColor;

  switch (exam) {
    case "TYT":
      bgClass =
        allLessons.TYT[lessonName as keyof typeof allLessons.TYT].bgClass;
      iconColor =
        allLessons.TYT[lessonName as keyof typeof allLessons.TYT].iconColor;
      break;
    case "AYT_SAY":
      bgClass =
        allLessons.AYT_SAY[lessonName as keyof typeof allLessons.AYT_SAY]
          .bgClass;
      iconColor =
        allLessons.AYT_SAY[lessonName as keyof typeof allLessons.AYT_SAY]
          .iconColor;
      break;
    case "AYT_EA":
      bgClass =
        allLessons.AYT_EA[lessonName as keyof typeof allLessons.AYT_EA].bgClass;
      iconColor =
        allLessons.AYT_EA[lessonName as keyof typeof allLessons.AYT_EA]
          .iconColor;
      break;
    default:
      bgClass = "bg-gray-100";
      iconColor = "text-gray-700";
      break;
  }

  return bgClass + iconColor;
};

export const getTopics = (exam?: Exam, lessonName?: LessonName) => {
  switch (exam) {
    case "TYT":
      return allLessons.TYT[lessonName as keyof typeof allLessons.TYT];

    case "AYT_SAY":
      return allLessons.AYT_SAY[lessonName as keyof typeof allLessons.AYT_SAY];

    case "AYT_EA":
      return allLessons.AYT_EA[lessonName as keyof typeof allLessons.AYT_EA];
    default:
      return [];
  }
};

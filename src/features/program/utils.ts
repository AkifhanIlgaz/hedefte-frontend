import { eachDayOfInterval, format } from "date-fns";
import { allLessons } from "../analiz/data";
import { Exam, LessonName } from "../analiz/types";
import { heatmapEnd, heatmapStart } from "./data";
import { DailyActivity, Heatmap } from "./types";

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
    case "AYT":
      bgClass = { ...allLessons.AYT_EA, ...allLessons.AYT_SAY }[
        lessonName as keyof typeof allLessons.AYT_EA
      ].bgClass;
      iconColor = { ...allLessons.AYT_EA, ...allLessons.AYT_SAY }[
        lessonName as keyof typeof allLessons.AYT_EA
      ].iconColor;
      break;
    default:
      bgClass = "bg-gray-100";
      iconColor = "text-gray-700";
      break;
  }

  return bgClass + iconColor;
};

export const getTopics = (exam?: Exam | "AYT", lessonName?: LessonName) => {
  if (!lessonName || !exam) return [];

  switch (exam) {
    case "TYT":
      return allLessons.TYT[lessonName as keyof typeof allLessons.TYT].topics;

    case "AYT_SAY":
      return allLessons.AYT_SAY[lessonName as keyof typeof allLessons.AYT_SAY]
        .topics;

    case "AYT_EA":
      return allLessons.AYT_EA[lessonName as keyof typeof allLessons.AYT_EA]
        .topics;

    case "AYT":
      return allLessons.AYT[lessonName as keyof typeof allLessons.AYT].topics;
    default:
      return [];
  }
};

export const getColor = (activity: {
  sessions: number;
  duration: number;
  questions: number;
}) => {
  const score =
    activity.sessions * 1 + activity.duration * 0.02 + activity.questions * 0.5;
  if (score <= 0) return "bg-activity-0";
  if (score <= 2) return "bg-activity-1";
  if (score <= 4) return "bg-activity-2";
  if (score <= 6) return "bg-activity-3";
  return "bg-activity-4";
};

export const getWeeks = (heatmap: Heatmap) => {
  const allDays = eachDayOfInterval({ start: heatmapStart, end: heatmapEnd });

  const weeks: DailyActivity[][] = [];
  let currentWeek: DailyActivity[] = [];

  const startDay = heatmapStart.getDay();
  const leadingPad = (startDay + 6) % 7;
  for (let i = 0; i < leadingPad; i++) {
    currentWeek.push({
      date: `pad-${i}`,
      activity: { sessions: 0, duration: 0, questions: 0 },
    });
  }

  allDays.forEach((day) => {
    const dayString = format(day, "yyyy-MM-dd");
    const activity = heatmap.activities[dayString];

    const dayData: DailyActivity = {
      date: dayString,
      activity: activity ?? { sessions: 0, duration: 0, questions: 0 },
    };
    currentWeek.push(dayData);

    if (day.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return weeks;
};

export const toDateKey = (d: string | Date) =>
  new Date(d).toLocaleDateString().split("T")[0];

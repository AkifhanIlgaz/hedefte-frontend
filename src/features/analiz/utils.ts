import { createClient } from "@/src/lib/supabase/client";
import { allLessons } from "./data";
import {
  AytEaLessonNames,
  AytMfLessonNames,
  Exam,
  TytLessonNames,
} from "./types";

export const fetcher = async (...args: [string, RequestInit?]) => {
  const supabase = createClient();

  const supabaseAccessToken = await supabase.auth
    .getSession()
    .then((res) => res.data.session?.access_token);

  if (!supabaseAccessToken) {
    throw new Error("Access token not found");
  }

  const [url, options] = args;
  const updatedOptions = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${supabaseAccessToken}`,
    },
  };

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  return fetch(`${baseUrl}/${url}`, updatedOptions).then((res) => res.json());
};

export const getLessonNames = (exam: Exam) => {
  if (exam === "TYT") return TytLessonNames;
  if (exam === "AYT_SAY") return AytMfLessonNames;
  if (exam === "AYT_EA") return AytEaLessonNames;
  return [];
};

export const getTableColumns = (exam: Exam) => {
  const lessonNames = getLessonNames(exam);

  const lessonColumns = lessonNames.map((lessonName) => ({
    key: `lesson:${lessonName}`,
    label: lessonName,
  }));

  const columns = [
    { key: "name", label: "İsim" },
    { key: "date", label: "Tarih" },
    ...lessonColumns,
    { key: "result", label: "Toplam Net" },
    { key: "actions", label: "" },
  ];

  return columns;
};

export const defaultLessonsForExam = (exam: Exam) => {
  const defaultLesson = (totalQuestions: number) => ({
    correct: 0,
    wrong: 0,
    empty: 0,
    time: 0,
    totalQuestions: totalQuestions,
    topicMistakes: [],
  });

  return {
    ...Object.values(allLessons[exam]).reduce(
      (acc, lesson) => {
        const name = lesson.name;
        acc[name] = defaultLesson(lesson.totalQuestions);
        return acc;
      },
      {} as Record<string, ReturnType<typeof defaultLesson>>,
    ),
  };
};

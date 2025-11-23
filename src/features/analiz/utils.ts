import { createClient } from "@/src/lib/supabase/client";
import { Field } from "../profil/types";
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

  return fetch(`${url}`, updatedOptions).then((res) => res.json());
};

export const getLessonNames = (exam: Exam, field?: Field) => {
  if (exam === "TYT") return TytLessonNames;

  return field === "Sayısal" ? AytMfLessonNames : AytEaLessonNames;
};

export const getTableColumns = (exam: Exam, field?: Field) => {
  const lessonNames = getLessonNames(exam, field);

  const lessonColumns = lessonNames.map((lessonName) => ({
    key: lessonName,
    label: lessonName,
  }));

  const columns = [
    { key: "name", label: "İsim" },
    { key: "date", label: "Tarih" },
    ...lessonColumns,
    { key: "totalNet", label: "Toplam Net" },
  ];

  return columns;
};

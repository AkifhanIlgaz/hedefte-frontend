"use client";

import {
  useExamAnalytics,
  useLessonAnalytics,
} from "@/src/lib/queries/useAnalytics";

export default function Page() {
  const { data: examData } = useExamAnalytics("TYT", -1);
  const { data: lessonData } = useLessonAnalytics("TYT", "Tarih", -1);

  console.log(examData);
  console.log(lessonData);

  return (
    <div>
      <h1>Analiz Sayfası</h1>
    </div>
  );
}

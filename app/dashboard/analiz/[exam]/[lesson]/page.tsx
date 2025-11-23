"use client";
import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import GeneralChart from "@/src/features/analiz/components/charts/generalChart";
import TopicMistakeChart from "@/src/features/analiz/components/charts/topicMistakeChart";
import {
  Exam,
  GeneralChartResponse,
  LessonChartPayload,
} from "@/src/features/analiz/types";
import { useChartData } from "@/src/queries/useChartData";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Select, SelectItem } from "@heroui/select";
import { BarChart3 } from "lucide-react";
import { use, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ lesson: string; exam: string }>;
}) {
  const { exam, lesson: encodedLesson } = use(params);
  const lesson = decodeURIComponent(encodedLesson);
  const [timeInterval, setTimeInterval] = useState(-1);
  const { data, isLoading, isError } = useChartData<
    GeneralChartResponse<LessonChartPayload>
  >({
    chartType: "lesson",
    examType: exam.toUpperCase() as Exam,
    lesson: lesson,
    timeInterval: timeInterval,
  });

  if (isLoading || isError) return;
  console.log(data);
  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title={`${exam.toUpperCase()} ${lesson.slice(0, 1).toUpperCase() + lesson.slice(1)} Analizi`}
          description="Çözdüğün denemelerinizi burada görebilirsiniz."
        />
        <div className="flex gap-2">
          <Select
            className="w-xs ml-auto"
            selectionMode="single"
            defaultSelectedKeys={new Set([timeInterval.toString()])}
            onChange={(event) => {
              const selectedKey = parseInt(event.target.value);
              setTimeInterval(selectedKey);
            }}
            disallowEmptySelection={true}
            color="primary"
          >
            <SelectItem key={"1"}>Son 1 Ay</SelectItem>
            <SelectItem key={"3"}>Son 3 Ay</SelectItem>
            <SelectItem key={"6"}>Son 6 Ay</SelectItem>
            <SelectItem key={"-1"}>Tüm Zamanlar</SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GeneralAnalysisCard
            title="Cozuelen Deneme sayisi"
            icon={BarChart3}
            value={data?.payload.examCount ?? 0}
          />
          <GeneralAnalysisCard
            title="Ortalama Net"
            icon={BarChart3}
            value={data?.payload.averageNet ?? 0}
          />
          <GeneralAnalysisCard
            title="Maksimum Net"
            icon={BarChart3}
            value={data?.payload.maxNet ?? 0}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <GeneralChart exams={data?.payload.exams ?? []} />
          <TopicMistakeChart topicMistakes={data?.payload.topicMistakes} />
        </div>
      </div>
    </div>
  );
}

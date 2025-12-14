"use client";
import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import GeneralChart from "@/src/features/analiz/components/charts/generalChart";
import { Exam } from "@/src/features/analiz/types";
import { useAnalyticsOfLesson } from "@/src/lib/queries/useAnalytics";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Select, SelectItem } from "@heroui/select";
import { BarChart3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { use, useState } from "react";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const searchParams = useSearchParams();
  const exam = searchParams.get("exam") as Exam;
  const examName = exam.split("_").join(" ");
  const { lesson: encodedLesson } = use(params);
  const lesson = decodeURIComponent(encodedLesson);
  const [timeInterval, setTimeInterval] = useState(-1);

  const { data: lessonData } = useAnalyticsOfLesson(exam, lesson, timeInterval);

  console.log(lessonData);

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title={`${examName} ${lesson} Analizi`}
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
            title="Çözülen Deneme Sayısı"
            icon={BarChart3}
            value={lessonData?.examCount ?? 0}
          />
          <GeneralAnalysisCard
            title="Ortalama Net"
            icon={BarChart3}
            value={lessonData?.averageResult.toFixed(2) ?? 0}
          />
          <GeneralAnalysisCard
            title="Maksimum Net"
            icon={BarChart3}
            value={lessonData?.maxResult.toFixed(2) ?? 0}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <GeneralChart
            resultSeries={lessonData?.resultSeries ?? []}
            averageResult={lessonData?.averageResult ?? 0}
            averageTime={lessonData?.averageTime ?? 0}
          />
          {/*<TopicMistakeChart
            topicMistakes={topicMistakes?.data.payload ?? []}
          />*/}
        </div>
      </div>
    </div>
  );
}

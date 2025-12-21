"use client";
import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import GeneralChart from "@/src/features/analiz/components/charts/generalChart";
import { Exam } from "@/src/features/analiz/types";
import { useAnalyticsOfLesson } from "@/src/lib/queries/analytics/useAnalytics";
import { useTopicWrongCounts } from "@/src/lib/queries/analytics/useTopicWrongCounts";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import {
  AlertCircle,
  ClipboardCheck,
  Hourglass,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { use, useState } from "react";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string; exam: string }>;
}) {
  const { lesson: encodedLesson, exam: encodedExam } = use(params);
  const lesson = decodeURIComponent(encodedLesson)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const exam = encodedExam.toUpperCase() as Exam;
  const examName = exam.split("_").join(" ");
  const [timeInterval, setTimeInterval] = useState(-1);

  const { data: lessonData } = useAnalyticsOfLesson(exam, lesson, timeInterval);

  const { data: topicWrongCounts } = useTopicWrongCounts(
    exam,
    lesson,
    timeInterval,
  );

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
            color="default"
          >
            <SelectItem key={"1"}>Son 1 Ay</SelectItem>
            <SelectItem key={"3"}>Son 3 Ay</SelectItem>
            <SelectItem key={"6"}>Son 6 Ay</SelectItem>
            <SelectItem key={"-1"}>Tüm Zamanlar</SelectItem>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GeneralAnalysisCard
            title="Çözülen Deneme Sayısı"
            icon={ClipboardCheck}
            value={lessonData?.examCount ?? 0}
          />
          <GeneralAnalysisCard
            title="Ortalama Net"
            icon={TrendingUp}
            value={lessonData?.averageResult.toFixed(2) ?? 0}
          />
          <GeneralAnalysisCard
            title="Ortalama Süre"
            icon={Hourglass}
            value={(lessonData?.averageTime ?? 0) + ` dk`}
          />
          <GeneralAnalysisCard
            title="Maksimum Net"
            icon={Trophy}
            value={lessonData?.maxResult.toFixed(2) ?? 0}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <GeneralChart
            resultSeries={lessonData?.resultSeries ?? []}
            averageResult={lessonData?.averageResult ?? 0}
            averageTime={lessonData?.averageTime ?? 0}
          />
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold">Konular</h3>
            </CardHeader>
            <CardBody
              className={
                topicWrongCounts
                  ? "flex flex-col gap-3 items-start justify-start"
                  : "flex flex-col items-center justify-center"
              }
            >
              {topicWrongCounts?.length === 0 ? (
                <div className="flex w-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-default-100 text-danger">
                    <AlertCircle className="h-6 w-6 text-danger" />
                  </span>
                  <p className="text-sm font-semibold text-default-700">
                    Henüz konu seçilmedi
                  </p>
                  <p className="text-xs text-default-500">
                    Yanlış yaptığın soruların konuları burada listelenecek.
                  </p>
                </div>
              ) : (
                <div className="grid w-full grid-cols-1 gap-3">
                  {topicWrongCounts?.map((val) => (
                    <div
                      key={val.topic}
                      className="flex items-center justify-between rounded-xl border border-default-200/80 bg-default-50 px-3 py-3 shadow-sm"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-default-800">
                          {val.topic}
                        </span>
                      </div>
                      <div className="flex p-2 items-center justify-center rounded-lg bg-danger/10 text-danger-600">
                        <span className="text-sm font-semibold">
                          {val.count} yanlış
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

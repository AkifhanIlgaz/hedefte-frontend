"use client";

import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import LessonCard from "@/src/features/analiz/components/cards/LessonCard";
import GeneralChart from "@/src/features/analiz/components/charts/generalChart";
import LessonGeneralChart from "@/src/features/analiz/components/charts/lessonGeneralChart";
import ExamsTable from "@/src/features/analiz/components/tables/examsTable";
import { allLessons } from "@/src/features/analiz/data";
import { Exam } from "@/src/features/analiz/types";
import {
  useExamAnalytics,
  useLessonAnalytics,
} from "@/src/lib/queries/useAnalytics";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import { Tab, Tabs } from "@heroui/tabs";
import { BarChart3, Plus } from "lucide-react";
import { use, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const [timeInterval, setTimeInterval] = useState(-1);
  const { exam: encodedExam } = use(params);
  const exam = encodedExam.toUpperCase() as Exam;
  const examName = exam.split("_").join(" ");
  const lessons = allLessons[exam];

  const { data: examData } = useExamAnalytics(exam, timeInterval);
  const { data: lessonData } = useLessonAnalytics(exam, timeInterval);

  return (
    <div className="flex flex-col gap-6  ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeader
          title={`${examName} Analizlerim`}
          description="Çözdüğün denemelerinizi burada görebilirsiniz."
        />
        <div className="flex w-full md:w-auto gap-2">
          <Select
            className="flex-1 md:w-[200px]"
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

          <Link
            className="flex-1 md:flex-none"
            href={`/dashboard/deneme/ekle?exam=${exam}`}
          >
            <Button
              className="w-full md:w-auto"
              color="primary"
              variant="shadow"
              startContent={<Plus className="size-4" />}
            >
              {exam.split("_")[0]} Analiz Ekle
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <GeneralAnalysisCard
            title="Çözülen Deneme Sayısı"
            icon={BarChart3}
            value={examData?.examCount}
          />
          <GeneralAnalysisCard
            title="Ortalama Net"
            icon={BarChart3}
            value={examData?.averageResult.toFixed(2)}
          />
          <GeneralAnalysisCard
            title="Maksimum Net"
            icon={BarChart3}
            value={examData?.maxResult.toFixed(2)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <GeneralChart
            resultSeries={examData?.resultSeries ?? []}
            averageResult={examData?.averageResult ?? 0}
          />
          <LessonGeneralChart lessons={lessonData ?? []} />
        </div>
      </div>

      <Tabs aria-label="Analiz Seçenekleri">
        <Tab key="ders" title="Ders Bazlı Analiz">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(lessons).map((lesson) => (
              <LessonCard key={lesson.name} lesson={lesson} />
            ))}
          </div>
        </Tab>
        <Tab key="photos" title="Tüm Denemeler">
          <ExamsTable exam={"TYT"} timeInterval={timeInterval} />
        </Tab>
      </Tabs>
    </div>
  );
}

"use client";

import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import LessonCard from "@/src/features/analiz/components/cards/LessonCard";
import GeneralChart from "@/src/features/analiz/components/charts/generalChart";
import LessonGeneralChart from "@/src/features/analiz/components/charts/lessonGeneralChart";
import ExamsTable from "@/src/features/analiz/components/tables/examsTable";
import { allLessons } from "@/src/features/analiz/data";
import {
  GeneralChartPayload,
  GeneralResponse,
} from "@/src/features/analiz/types";
import { useChartData } from "@/src/queries/useChartData";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import { Tab, Tabs } from "@heroui/tabs";
import { BarChart3, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [timeInterval, setTimeInterval] = useState(-1);
  const lessons = allLessons.AYT_SAY;

  const { data, isLoading, isError } = useChartData<
    GeneralResponse<GeneralChartPayload>
  >({
    chartType: "general",
    examType: "AYT",
    timeInterval: timeInterval,
  });

  if (isLoading && isError) return;

  return (
    <div className="flex flex-col gap-6  ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeader
          title="Deneme Analizlerim"
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
            href={`/dashboard/analiz/ayt/ea/ekle`}
          >
            <Button
              className="w-full md:w-auto"
              color="primary"
              variant="shadow"
              startContent={<Plus className="size-4" />}
            >
              AYT Analiz Ekle
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <GeneralAnalysisCard
            title="Çözülen Deneme Sayısı"
            icon={BarChart3}
            value={data?.payload.examCount}
          />
          <GeneralAnalysisCard
            title="Ortalama Net"
            icon={BarChart3}
            value={data?.payload.averageNet.toFixed(2)}
          />
          <GeneralAnalysisCard
            title="Maksimum Net"
            icon={BarChart3}
            value={data?.payload.maxNet.toFixed(2)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <GeneralChart exams={data?.payload.exams ?? []} />
          <LessonGeneralChart lessons={data?.payload.lessons} />
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
          <ExamsTable exam={"AYT_SAY"} timeInterval={timeInterval} />
        </Tab>
      </Tabs>
    </div>
  );
}

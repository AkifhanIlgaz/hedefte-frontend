"use client";

import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import LessonCard from "@/src/features/analiz/components/cards/LessonCard";
import GeneralChart from "@/src/features/analiz/components/charts/generalChart";
import LessonGeneralChart from "@/src/features/analiz/components/charts/lessonGeneralChart";
import ExamsTable from "@/src/features/analiz/components/tables/examsTable";
import { getLessons } from "@/src/features/analiz/data";
import {
  Exam,
  GeneralChartPayload,
  GeneralChartResponse,
} from "@/src/features/analiz/types";
import { ExamInfo, Field } from "@/src/features/profil/types";
import { createClient } from "@/src/lib/supabase/client";
import { useChartData } from "@/src/queries/useChartData";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import { Tab, Tabs } from "@heroui/tabs";
import { BarChart3, Plus } from "lucide-react";
import { use, useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = use(params);
  const [timeInterval, setTimeInterval] = useState(-1);
  const [field, setField] = useState<Field | undefined>();
  const lessons = getLessons(exam.toUpperCase() as Exam, field);
  const { data, isLoading, isError } = useChartData<
    GeneralChartResponse<GeneralChartPayload>
  >({
    chartType: "general",
    examType: exam.toUpperCase() as Exam,
    timeInterval: timeInterval,
  });

  if (isLoading && isError) return;

  console.log(data);
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) console.error("Kullanıcı bilgisi alınamadı:", error.message);

      const examInfo = data.user?.user_metadata["examInfo"] as ExamInfo;

      setField(examInfo.field as Field);
    };

    getUser();
  }, []);

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Deneme Analizlerim"
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

          <Link href={`/dashboard/analiz/ekle?exam=TYT`}>
            <Button
              color="primary"
              variant="shadow"
              startContent={<Plus className="size-4" />}
            >
              TYT Analiz Ekle
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GeneralAnalysisCard
            title="Cozuelen Deneme sayisi"
            icon={BarChart3}
            value={data?.payload.examCount}
          />
          <GeneralAnalysisCard
            title="Ortalama Net"
            icon={BarChart3}
            value={data?.payload.averageNet}
          />
          <GeneralAnalysisCard
            title="Maksimum Net"
            icon={BarChart3}
            value={data?.payload.maxNet}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <GeneralChart exams={data?.payload.exams ?? []} />
          <LessonGeneralChart lessons={data?.payload.lessons} />
        </div>
      </div>

      <Tabs>
        <Tab key="ders" title="ders bazli analiz">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.values(lessons).map((lesson) => (
              <LessonCard key={lesson.name} lesson={lesson} />
            ))}
          </div>
        </Tab>
        <Tab key="photos" title="all_exams">
          <ExamsTable
            exam={exam as Exam}
            timeInterval={timeInterval}
            field={field}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

"use client";

import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import LessonCard from "@/src/features/analiz/components/cards/LessonCard";
import ExamsTable from "@/src/features/analiz/components/tables/examsTable";
import { tytLessons } from "@/src/features/analiz/data";
import { Exam } from "@/src/features/analiz/types";
import { ExamInfo, Field } from "@/src/features/profil/types";
import { createClient } from "@/src/lib/supabase/client";
import { useChartData } from "@/src/queries/useChartData";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import { Tab, Tabs } from "@heroui/tabs";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { BarChart3, Plus } from "lucide-react";
import { use, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const barChartData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
  },
];

function prepareChartData(
  rawData: { date: string; name: string; totalNet: number }[],
) {
  const monthGroups: Record<string, typeof rawData> = {};

  rawData.forEach((item) => {
    const monthYear = format(new Date(item.date), "MMM yyyy", { locale: tr }); // Örn: "Haz 2024"
    if (!monthGroups[monthYear]) monthGroups[monthYear] = [];
    monthGroups[monthYear].push(item);
  });

  const months = Object.keys(monthGroups).sort((a, b) => {
    const dateA = new Date(monthGroups[a][0].date);
    const dateB = new Date(monthGroups[b][0].date);
    return dateA.getTime() - dateB.getTime();
  });

  const chartData: {
    x: number;
    month: string;
    name: string;
    date: string;
    totalNet: number;
  }[] = [];

  months.forEach((month, monthIndex) => {
    const items = monthGroups[month];
    items.forEach((item, i) => {
      const jitter = (i - (items.length - 1) / 2) * 0.2; // -0.2, 0, +0.2 gibi
      chartData.push({
        x: monthIndex + jitter,
        month,
        name: item.name,
        date: item.date,
        totalNet: item.totalNet,
      });
    });
  });

  return { chartData, months };
}
export interface GeneralChartPayload {
  examCount: number;
  maxNet: number;
  averageNet: number;
  exams: {
    date: string;
    name: string;
    totalNet: number;
  }[];
}

export interface GeneralChartResponse {
  success: boolean;
  message: string;
  payload: GeneralChartPayload;
  timestamp: string;
}

export default function Page({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam } = use(params);
  const [timeInterval, setTimeInterval] = useState(1);
  const [field, setField] = useState<Field | undefined>();

  const { data, isLoading, isError } = useChartData<GeneralChartResponse>({
    chartType: "general",
    examType: exam.toUpperCase() as Exam,
    timeInterval: timeInterval,
  });

  if (isLoading && isError) return;

  const { chartData, months } = prepareChartData(data?.payload.exams ?? []);

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
    <div className="flex flex-col gap-6 ">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-sm font-bold text-muted-foreground">
              <span>TYT Denemelerim</span>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  accessibilityLayer
                  style={{
                    width: "100%",

                    aspectRatio: 1.618,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#fcd34d"
                    opacity={0.4}
                  />
                  <XAxis
                    type="number"
                    dataKey="x"
                    ticks={months.map((_, idx) => idx)}
                    domain={[0, months.length - 1]}
                    tickFormatter={(idx) => months[idx]}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    width={"auto"}
                  />
                  <Line
                    dataKey="totalNet"
                    stroke="#d97706"
                    strokeWidth={2}
                    type="linear"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>{" "}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-sm font-bold text-muted-foreground">
              <span>
                Dersin ortalama netleri ve ortalama sureleri bar chart olacak
              </span>
            </CardHeader>
            <CardBody>
              <BarChart
                data={barChartData}
                accessibilityLayer
                style={{
                  width: "100%",
                  aspectRatio: 1.618,
                }}
                responsive={true}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width={"auto"} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </CardBody>
          </Card>
        </div>
      </div>

      <Tabs>
        <Tab key="ders" title="ders bazli analiz">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.values(tytLessons).map((lesson) => (
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

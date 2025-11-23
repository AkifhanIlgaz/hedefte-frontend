"use client";

import { Card, CardBody } from "@heroui/card";
import { ApexOptions } from "apexcharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import dynamic from "next/dynamic";
import { LessonName } from "../../types";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
  lessons: Record<
    LessonName,
    {
      averageNet: number;
      maxNet: number;
      averageTime: number;
    }
  >;
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

export default function GeneralChart({
  exams,
}: {
  exams: { date: string; name: string; totalNet: number }[];
}) {
  const { chartData, months } = prepareChartData(exams);

  // ApexCharts için yapılandırma
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    xaxis: {
      categories: months,
      labels: {
        style: { fontSize: "12px" },
      },
    },
    title: {
      text: "Tüm Denemelerim",
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold" },
    },
    yaxis: {
      title: { text: "Toplam Net" },
      labels: {
        formatter: (val: number) => val.toFixed(2),
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    colors: ["#d97706"],
  };

  const series = [
    {
      name: "Toplam Net",
      data: chartData.map((item) => item.totalNet),
    },
  ];
  return (
    <Card>
      <CardBody>
        <Chart options={chartOptions} series={series} type="line" />
      </CardBody>
    </Card>
  );
}

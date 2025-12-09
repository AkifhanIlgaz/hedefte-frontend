"use client";

import { Card, CardBody } from "@heroui/card";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { LessonName } from "../../types";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LessonGeneralChartProps {
  lessons?: Record<
    LessonName,
    {
      averageNet: number;
      maxNet: number;
      averageTime: number;
    }
  >;
}

export default function LessonGeneralChart({
  lessons,
}: LessonGeneralChartProps) {
  const sortedLessons = Object.entries(lessons ?? {}).sort(
    ([, a], [, b]) => b.averageNet - a.averageNet,
  ); // Büyükten küçüğe sıralama

  const averageNets = sortedLessons.map(([_, lesson]) =>
    Number(lesson.averageNet.toFixed(2)),
  );
  const maxNets = sortedLessons.map(([_, lesson]) =>
    Number(lesson.maxNet.toFixed(2)),
  );
  const averageTimes = sortedLessons.map(([_, lesson]) =>
    Number(lesson.averageTime.toFixed(2)),
  );

  const series: ApexAxisChartSeries = [
    {
      name: "En Fazla Net",
      data: maxNets,
    },
    {
      name: "Ortalama Net",
      data: averageNets,
    },
    {
      name: "Ortalama Süre",
      data: averageTimes,
    },
  ];

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    xaxis: {
      categories: sortedLessons.map(([lessonName, _]) => lessonName),
    },
    yaxis: {
      min: 0,
    },
    title: {
      text: "Ders Bazlı Analiz",
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold" },
    },

    fill: {
      opacity: 1,
    },
    tooltip: {},
  };

  return (
    <Card>
      <CardBody>
        <Chart options={options} series={series} type="bar"></Chart>
      </CardBody>
    </Card>
  );
}

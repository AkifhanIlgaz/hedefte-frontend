"use client";

import { Card, CardBody } from "@heroui/card";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TopicMistakeChartProps {
  topicMistakes?: Record<string, number>;
}

export default function TopicMistakeChart({
  topicMistakes,
}: TopicMistakeChartProps) {
  const sortedTopics = Object.entries(topicMistakes ?? {}).sort(
    ([, a], [, b]) => b - a,
  ); // Büyükten küçüğe sıralama

  const mistakeCounts = sortedTopics.map(([_, count]) => count);

  const series: ApexAxisChartSeries = [
    {
      name: "En Fazla Yanlis Yapilan Konular",
      data: mistakeCounts,
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
      categories: sortedTopics.map(([topicName, _]) => topicName),
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

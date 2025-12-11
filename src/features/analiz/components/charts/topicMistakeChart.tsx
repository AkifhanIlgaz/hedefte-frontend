"use client";

import { Card, CardBody } from "@heroui/card";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { TopicMistake } from "../../types";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TopicMistakeChartProps {
  topicMistakes?: TopicMistake[];
}

export default function TopicMistakeChart({
  topicMistakes = [],
}: TopicMistakeChartProps) {
  const theme = useTheme();
  const isDark = theme.theme === "dark";

  const axisColor = isDark ? "#e5e7eb" : "#000000";
  const labelColor = isDark ? "#e5e7eb" : "#000000";
  const accentColor = "#ef7c00";

  const topicCounts = topicMistakes.reduce<Record<string, number>>(
    (acc, { topicName }) => {
      if (!topicName) return acc;
      acc[topicName] = (acc[topicName] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);
  const categories = sortedTopics.map(([name]) => name);
  const mistakeCounts = sortedTopics.map(([, count]) => count);

  const series: ApexAxisChartSeries = [
    {
      name: "Yanlış Sayısı",
      data: [...mistakeCounts],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: "100%",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 5, barHeight: "65%" },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories,
      min: 0,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        maxWidth: 180,
        style: {
          colors: categories.map(() => axisColor),
          fontWeight: 600,
          fontFamily: "Outfit",
        },
      },
    },
    title: {
      text: "Yanlış Yapılan Konular",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: labelColor,
        fontFamily: "Outfit",
      },
    },
    colors: [accentColor],
    fill: { opacity: 0.95 },
    legend: { position: "bottom" },
    tooltip: {
      shared: false,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const topicName =
          (w?.globals?.labels?.[dataPointIndex] as string | undefined) ?? "";
        const count =
          series?.[seriesIndex]?.[dataPointIndex] !== undefined
            ? series[seriesIndex][dataPointIndex]
            : "—";

        return `
          <div style="padding:8px 10px;min-width:180px;display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:13px;font-weight:600;color:#111827;">${topicName}</span>
            <span style="font-size:13px;color:${accentColor};">Yanlış Sayısı: ${count}</span>
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 960,
        options: {
          plotOptions: { bar: { barHeight: "75%" } },
          yaxis: { labels: { maxWidth: 140 } },
        },
      },
    ],
  };

  return (
    <Card className="h-full">
      <CardBody className="h-full w-full">
        <Chart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </CardBody>
    </Card>
  );
}

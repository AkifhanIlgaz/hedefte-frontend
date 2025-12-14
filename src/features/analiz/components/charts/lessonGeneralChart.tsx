"use client";

import { Card, CardBody } from "@heroui/card";
import { ApexOptions } from "apexcharts";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { LessonAnalytics } from "../../types";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LessonGeneralChartProps {
  lessons: LessonAnalytics[];
}

export default function LessonGeneralChart({
  lessons,
}: LessonGeneralChartProps) {
  const theme = useTheme();
  const isDark = theme.theme === "dark";

  const axisColor = isDark ? "#e5e7eb" : "#111827";
  const labelColor = isDark ? "#e5e7eb" : "#111827";
  const accentColor = "#ef7c00";
  const secondaryColor = isDark ? "#38bdf8" : "#0ea5e9";
  const tertiaryColor = isDark ? "#a855f7" : "#7c3aed";

  const safeFixed = (value: unknown, fraction = 2) => {
    const num = Number(value);
    return Number.isFinite(num) ? num.toFixed(fraction) : "0.00";
  };

  const chartHeight = Math.max(320, lessons.length * 52);

  const averageResults = lessons.map((lesson) =>
    Number(safeFixed(lesson.averageResult ?? 0)),
  );
  const maxResults = lessons.map((lesson) =>
    Number(safeFixed(lesson.maxResult ?? 0)),
  );
  const averageTimes = lessons.map((lesson) =>
    Number(safeFixed(lesson.averageTime ?? 0)),
  );

  const series = [
    {
      name: "En Fazla Net",
      data: maxResults,
    },
    {
      name: "Ortalama Net",
      data: averageResults,
    },
    {
      name: "Ortalama Süre",
      data: averageTimes,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: chartHeight,
      toolbar: { show: false },
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    yaxis: {
      labels: {
        style: {
          colors: Array(lessons.length).fill(axisColor),
          fontSize: "12px",
          fontFamily: "Outfit",
        },
      },
      axisBorder: { color: axisColor },
      axisTicks: { color: axisColor },
    },
    xaxis: {
      categories: lessons.map((lesson) => lesson.lesson),

      min: 0,
      labels: {
        style: { colors: [axisColor], fontFamily: "Outfit" },
        formatter: (val: number | string) => safeFixed(val),
      },
      title: {
        text: "Net / Süre",
        style: { color: axisColor, fontFamily: "Outfit" },
      },
      axisBorder: { color: axisColor },
      axisTicks: { color: axisColor },
    },
    title: {
      text: "Ders Bazlı Analiz",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: labelColor,
        fontFamily: "Outfit",
      },
    },

    legend: {
      position: "bottom",
      labels: { colors: labelColor },
    },
    colors: [accentColor, secondaryColor, tertiaryColor],
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number, opts) =>
          opts.seriesIndex === 2 ? `${safeFixed(val)} dk` : safeFixed(val),
      },
      style: {
        fontSize: "12px",
        fontFamily: "Outfit",
      },
    },
    grid: {
      borderColor: isDark ? "#374151" : "#e5e7eb",
      strokeDashArray: 3,
    },
    responsive: [
      {
        breakpoint: 960,
        options: {
          chart: {
            height: Math.max(280, lessons.length * 64),
          },
          plotOptions: {
            bar: {
              barHeight: "70%",
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "11px",
                colors: Array(lessons.length).fill(axisColor),
                fontFamily: "Outfit",
              },
            },
          },
        },
      },
    ],
  };

  return (
    <Card>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={"100%"} />
      </CardBody>
    </Card>
  );
}

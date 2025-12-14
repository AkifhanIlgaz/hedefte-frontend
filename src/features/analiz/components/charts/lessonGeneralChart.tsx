"use client";

import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { ApexOptions } from "apexcharts";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { LessonAnalytics } from "../../types";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LessonGeneralChartProps {
  isPending?: boolean;
  isError?: boolean;
  lessons: LessonAnalytics[];
}

export default function LessonGeneralChart({
  isPending = false,
  isError = false,
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

  const hasData = lessons.length > 0;

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
    noData: {
      text: "Henüz bir deneme eklemediniz !",
      align: "center",
      verticalAlign: "middle",

      style: {
        color: "#374151",
        fontSize: "14px",
        fontFamily: "Outfit",
      },
    },
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
      show: hasData,
      width: 1,
      colors: ["transparent"],
    },
    yaxis: {
      show: hasData,
      labels: {
        show: hasData,
        style: {
          colors: Array(lessons.length).fill(axisColor),
          fontSize: "12px",
          fontFamily: "Outfit",
        },
      },
      axisBorder: { color: axisColor, show: hasData },
      axisTicks: { color: axisColor, show: hasData },
    },
    xaxis: {
      categories: lessons.map((lesson) => lesson.lesson),
      min: 0,
      labels: {
        show: hasData,
        style: { colors: [axisColor], fontFamily: "Outfit" },
        formatter: (val: number | string) => safeFixed(val),
      },

      title: {
        text: "Net / Süre",
        style: { color: axisColor, fontFamily: "Outfit" },
        offsetX: 0,
        offsetY: 15,
      },
      axisBorder: { color: axisColor, show: hasData },
      axisTicks: { color: axisColor, show: hasData },
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
      show: hasData,
      labels: { colors: labelColor },
      fontFamily: "Outfit",
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
      show: hasData,
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
  if (isError) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center text-danger text-sm gap-1">
          <AlertTriangle className="size-6" />
          Deneme analizleri yüklenirken bir sorun oluştu.
        </CardBody>
      </Card>
    );
  }
  if (isPending) {
    return (
      <Card>
        <CardBody className="flex items-center justify-center">
          <Spinner
            label="Deneme analizleri yükleniyor ..."
            color="primary"
            labelColor="secondary"
            classNames={{
              label: "text-sm",
            }}
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={"100%"} />
      </CardBody>
    </Card>
  );
}

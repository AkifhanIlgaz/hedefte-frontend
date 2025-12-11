"use client";

import { Card, CardBody } from "@heroui/card";
import { ApexOptions } from "apexcharts";
import { format, isValid as isValidDate, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { LessonName } from "../../types";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function prepareChartData(
  rawData: { date: string; name: string; totalNet: number }[],
) {
  const toDate = (value: string) => {
    const parsed = parseISO(value);
    if (isValidDate(parsed)) return parsed;
    const fallback = new Date(value);
    return isValidDate(fallback) ? fallback : new Date();
  };

  const sorted = [...rawData].sort(
    (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime(),
  );

  const dateCounts: Record<string, number> = {};
  sorted.forEach((item) => {
    const key = format(toDate(item.date), "yyyy-MM-dd");
    dateCounts[key] = (dateCounts[key] || 0) + 1;
  });

  const dateSeen: Record<string, number> = {};
  const chartData = sorted.map((item) => {
    const baseDate = toDate(item.date);
    const key = format(baseDate, "yyyy-MM-dd");
    const seenCount = dateSeen[key] || 0;
    const totalCount = dateCounts[key] || 1;

    // Spread points on the same day by 30-minute steps so markers don't overlap.
    const jitterMinutes =
      totalCount > 1 ? (seenCount - (totalCount - 1) / 2) * 30 : 0;

    dateSeen[key] = seenCount + 1;

    return {
      x: baseDate.getTime() + jitterMinutes * 60 * 1000,
      y: item.totalNet,
      name: item.name,
      date: item.date,
      totalNet: item.totalNet,
    };
  });

  return { chartData };
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
  const theme = useTheme();
  const isDark = theme.theme === "dark";

  const axisColor = isDark ? "#e5e7eb" : "#000000";
  const labelColor = isDark ? "#e5e7eb" : "#000000";
  const accentColor = "#ef7c00";

  const { chartData } = prepareChartData(exams);
  const sortedChartData = [...chartData].sort((a, b) => a.x - b.x);
  const monthTicks: number[] = [];
  let minDate: number | undefined;
  let maxDate: number | undefined;
  if (sortedChartData.length > 0) {
    const xs = sortedChartData
      .map((item) => item.x)
      .filter((v) => Number.isFinite(v));
    minDate = Math.min(...xs);
    maxDate = Math.max(...xs);

    const start = new Date(minDate);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(maxDate);
    end.setDate(1);
    end.setHours(0, 0, 0, 0);

    for (
      let cursor = new Date(start);
      cursor.getTime() <= end.getTime();
      cursor.setMonth(cursor.getMonth() + 1)
    ) {
      monthTicks.push(cursor.getTime());
    }
  }

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
      type: "datetime",
      min: minDate,
      max: maxDate,
      tickAmount: Math.max(monthTicks.length, 2),
      labels: {
        style: { fontSize: "12px", colors: axisColor },
        showDuplicates: false,
        formatter: (value) =>
          format(new Date(Number(value)), "MMM yyyy", {
            locale: tr,
          }),
      },
    },
    title: {
      text: "Tüm Denemelerim",
      align: "left",
      style: { fontSize: "16px", fontWeight: "bold", color: labelColor },
    },
    yaxis: {
      title: { text: "Toplam Net", style: { color: axisColor } },
      min: 0,
      labels: {
        style: { colors: [axisColor] },
        formatter: (val: number) => val.toFixed(2),
      },
    },
    tooltip: {
      shared: false,
      theme: isDark ? "dark" : "light",
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const point =
          (w?.globals?.initialSeries?.[seriesIndex]?.data?.[dataPointIndex] as
            | { x?: string; y?: number; name?: string; date?: string }
            | undefined) ?? null;

        if (!point) return "";

        const dateLabel = point.date
          ? format(new Date(point.date), "dd MMM yyyy", { locale: tr })
          : "";
        const nameLabel = point.name ?? "";
        const netLabel = typeof point.y === "number" ? point.y.toFixed(2) : "—";

        return `
          <div style="padding:8px 10px;min-width:180px;display:flex;flex-direction:column;gap:4px;">
            <span style="font-size:12px;color:${isDark ? "#9ca3af" : "#6b7280"};">${dateLabel}</span>
            <span style="font-size:13px;font-weight:600;color:${labelColor};">${nameLabel}</span>
            <span style="font-size:13px;color:${accentColor};">Toplam Net: ${netLabel}</span>
          </div>
        `;
      },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    colors: [accentColor],
  };

  const series = [
    {
      name: "Toplam Net",
      data: sortedChartData,
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

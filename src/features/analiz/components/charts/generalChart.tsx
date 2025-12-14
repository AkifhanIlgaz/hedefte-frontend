"use client";

import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { ApexOptions } from "apexcharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { LessonResultSeries, ResultSeries } from "../../types";

// Chart bileşenini dinamik olarak yükle ve SSR'yi devre dışı bırak
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface GeneralChartProps {
  isPending?: boolean;
  isError?: boolean;
  averageResult: number;
  averageTime?: number;
  resultSeries: ResultSeries[] | LessonResultSeries[];
}

export default function GeneralChart({
  isPending = false,
  isError = false,
  averageResult,
  averageTime,
  resultSeries,
}: GeneralChartProps) {
  const theme = useTheme();
  const isDark = theme.theme === "dark";

  const axisColor = isDark ? "#e5e7eb" : "#000000";
  const labelColor = isDark ? "#e5e7eb" : "#000000";
  const accentColor = "#ef7c00";
  const timeColor = isDark ? "#38bdf8" : "#0ea5e9";
  const annotationColor = isDark
    ? "rgba(239,124,0,0.55)"
    : "rgba(239,124,0,0.35)";
  const dateTextClass = isDark ? "text-default-400" : "text-default-500";
  const nameTextClass = isDark ? "text-default-100" : "text-default-900";
  const netTextClass = "text-[#ef7c00]";
  const timeTextClass = isDark ? "text-primary-400" : "text-primary-600";

  type WithTimestamp = {
    timestamp: number;
    date: Date;
    name: string;
    result: number;
    time?: number;
  };

  type MappedPoint = {
    x: number;
    net: number;
    time?: number;
    name?: string;
    date?: number;
  };

  const mappedSeries = useMemo<MappedPoint[]>(() => {
    const withTimestamps: WithTimestamp[] = (
      resultSeries as (ResultSeries | LessonResultSeries)[]
    ).map((item) => {
      const timeValue = (item as LessonResultSeries).time;
      return {
        ...item,
        time: typeof timeValue === "number" ? timeValue : undefined,
        timestamp: new Date(item.date).getTime(),
      };
    });

    withTimestamps.sort((a, b) => a.timestamp - b.timestamp);

    const seenOnDay = new Map<number, number>();
    const offsetMs = 60 * 60 * 1000; // shift by 1 hour for points on the same day

    return withTimestamps.map(({ timestamp, result, name, time }) => {
      const count = seenOnDay.get(timestamp) ?? 0;
      seenOnDay.set(timestamp, count + 1);

      return {
        x: timestamp + count * offsetMs,
        net: Number(result ?? 0),
        name,
        date: timestamp,
        time: typeof time === "number" ? time : undefined,
      };
    });
  }, [resultSeries]);

  const xValues = mappedSeries.map((item) => item.x);
  const xMin = xValues.length ? Math.min(...xValues) : undefined;
  const xMax = xValues.length ? Math.max(...xValues) : undefined;
  const hasData = resultSeries.length > 0;
  const hasTimeSeries = resultSeries.some(
    (item) =>
      typeof (item as LessonResultSeries).time === "number" &&
      Number.isFinite((item as LessonResultSeries).time),
  );
  const averageTimeValue =
    typeof averageTime === "number" && Number.isFinite(averageTime)
      ? averageTime
      : null;
  const hasAverageTime = hasTimeSeries && averageTimeValue !== null;

  const series: ApexAxisChartSeries = [
    {
      name: "Toplam Net",
      data: mappedSeries.map((pt) => ({
        x: pt.x,
        y: pt.net,
        name: pt.name,
        date: pt.date,
        net: pt.net,
        time: pt.time,
      })),
    },
  ];

  if (hasTimeSeries) {
    series.push({
      name: "Süre (dk)",
      data: mappedSeries.map((pt) => ({
        x: pt.x,
        y: typeof pt.time === "number" ? pt.time : 0,
        name: pt.name,
        date: pt.date,
        net: pt.net,
        time: pt.time,
      })),
    });
  }

  // ApexCharts için yapılandırma
  const chartOptions: ApexOptions = {
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
      type: "line",
      zoom: {
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    xaxis: {
      type: "datetime",
      min: xMin,
      max: xMax,
      labels: {
        style: { fontSize: "12px", colors: axisColor, fontFamily: "Outfit" },
        show: hasData,
        showDuplicates: false,

        formatter: (value) =>
          format(new Date(Number(value)), "MMM yyyy", {
            locale: tr,
          }),
      },
      axisBorder: { show: hasData, color: axisColor },
      axisTicks: { show: hasData, color: axisColor },
    },
    title: {
      text: "Tüm Denemelerim",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: labelColor,
        fontFamily: "Outfit",
      },
    },
    yaxis: hasTimeSeries
      ? [
          {
            show: hasData,
            title: {
              text: "Toplam Net",
              style: { color: axisColor, fontFamily: "Outfit" },
            },
            min: 0,
            labels: {
              show: hasData,
              style: { colors: [axisColor], fontFamily: "Outfit" },
              formatter: (val: number) => val.toFixed(2),
            },
          },
          {
            show: hasData,
            title: {
              text: "Süre (dk)",
              style: { color: axisColor, fontFamily: "Outfit" },
            },
            opposite: true,
            min: 0,
            labels: {
              show: hasData,
              style: { colors: [axisColor], fontFamily: "Outfit" },
              formatter: (val: number) => val.toFixed(2),
            },
          },
        ]
      : {
          show: hasData,
          title: {
            text: "Toplam Net",
            style: { color: axisColor, fontFamily: "Outfit" },
          },
          min: 0,
          labels: {
            show: hasData,
            style: { colors: [axisColor], fontFamily: "Outfit" },
            formatter: (val: number) => val.toFixed(2),
          },
        },
    annotations: {
      yaxis: [
        {
          y: averageResult,
          borderColor: annotationColor,
          strokeDashArray: 6,

          label: {
            borderColor: annotationColor,
            style: {
              color: isDark ? "#111827" : "#ffffff",
              background: annotationColor,
              fontFamily: "Outfit",
            },
            text: `Ortalama Net: ${averageResult.toFixed(2)}`,
          },
        },
        ...(hasAverageTime
          ? [
              {
                y: averageTimeValue ?? 0,
                yAxisIndex: 1,
                borderColor: timeColor,
                strokeDashArray: 6,
                label: {
                  borderColor: timeColor,
                  style: {
                    color: isDark ? "#0b1021" : "#ffffff",
                    background: timeColor,
                    fontFamily: "Outfit",
                  },
                  text: `Ortalama Süre: ${(averageTimeValue ?? 0).toFixed(2)} dk`,
                },
              },
            ]
          : []),
      ],
    },
    markers: {
      size: 5,
      strokeColors: isDark ? "#1f2937" : "#ffffff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    tooltip: {
      shared: false,
      theme: isDark ? "dark" : "light",
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const point =
          (w?.globals?.initialSeries?.[seriesIndex]?.data?.[dataPointIndex] as
            | {
                x?: number | string;
                y?: number;
                name?: string;
                date?: number;
                time?: number;
                net?: number;
              }
            | undefined) ?? null;

        if (!point) return "";

        const dateLabel = point.date ?? point.x;
        const formattedDate = dateLabel
          ? format(new Date(dateLabel), "dd MMM yyyy", { locale: tr })
          : "";
        const nameLabel = point.name ?? "";
        const isTimeSeries = hasTimeSeries && seriesIndex === 1;
        const netValue =
          typeof point.net === "number"
            ? point.net
            : !isTimeSeries && typeof point.y === "number"
              ? point.y
              : null;
        const timeValue =
          typeof point.time === "number"
            ? point.time
            : isTimeSeries && typeof point.y === "number"
              ? point.y
              : null;
        const netLabel = netValue !== null ? netValue.toFixed(2) : undefined;
        const timeLabel =
          timeValue !== null && timeValue !== undefined
            ? `${timeValue.toFixed(2)} dk`
            : null;

        return `
          <div class="flex min-w-[180px] flex-col gap-1 px-2.5 py-2">
            <span class="text-xs ${dateTextClass}">${formattedDate}</span>
            <span class="text-sm font-semibold ${nameTextClass}">${nameLabel}</span>
            ${netLabel ? `<span class="text-sm ${netTextClass}">Toplam Net: ${netLabel}</span>` : ""}
            ${timeLabel ? `<span class="text-sm ${timeTextClass}">Süre: ${timeLabel}</span>` : ""}
          </div>
        `;
      },
    },
    grid: {
      show: hasData,
      borderColor: isDark ? "#374151" : "#e5e7eb",
      strokeDashArray: 3,
    },
    stroke: {
      show: hasData,
      curve: "straight",
      width: hasTimeSeries ? [3, 2] : 3,
    },
    colors: hasTimeSeries ? [accentColor, timeColor] : [accentColor],
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
        <Chart options={chartOptions} series={series} type="line" />
      </CardBody>
    </Card>
  );
}

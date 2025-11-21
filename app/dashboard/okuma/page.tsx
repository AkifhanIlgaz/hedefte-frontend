"use client";

import { eachDayOfInterval, format, startOfYear } from "date-fns";
import React from "react";

const sampleData = [
  { date: "2025-11-01", count: 1 },
  { date: "2025-11-02", count: 3 },
  { date: "2025-11-05", count: 5 },
  { date: "2025-11-10", count: 2 },
  { date: "2025-11-15", count: 7 },
];

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">GitHub Tarzı Heatmap</h1>
      <Heatmap data={sampleData} />
    </div>
  );
}

type DayData = {
  date: string; // YYYY-MM-DD
  count: number;
};

type HeatmapProps = {
  data: DayData[];
};

const getColor = (count: number) => {
  if (count === 0) return "bg-gray-200";
  if (count <= 2) return "bg-green-200";
  if (count <= 4) return "bg-green-400";
  if (count <= 6) return "bg-green-600";
  return "bg-green-800";
};

const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const start = startOfYear(new Date());
  const end = new Date();

  const allDays = eachDayOfInterval({ start, end });

  // Haftalara ayır
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];
  allDays.forEach((day) => {
    const dayString = format(day, "yyyy-MM-dd");
    const dayData = data.find((d) => d.date === dayString) || {
      date: dayString,
      count: 0,
    };
    currentWeek.push(dayData);

    if (day.getDay() === 6) {
      // Cumartesi haftanın sonu
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length) weeks.push(currentWeek);

  // Haftalık ilk günlerden ay etiketleri
  const monthLabels = weeks.map((week) => {
    const firstDay = week[0];
    const month = format(new Date(firstDay.date), "MMM");
    return month;
  });

  return (
    <div className="flex">
      {/* Gün isimleri */}
      <div className="flex flex-col justify-start mr-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-5 mb-1 text-xs text-gray-500 flex items-center justify-end pr-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        {/* Üstte ay etiketleri */}
        <div className="flex mb-1 ml-1">
          {monthLabels.map((month, i) => (
            <div key={i} className="w-5 text-xs text-gray-500 text-center">
              {i === 0 || month !== monthLabels[i - 1] ? month : ""}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1 mr-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-5 h-5 rounded ${getColor(day.count)}`}
                  title={`${day.date}: ${day.count} activity`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

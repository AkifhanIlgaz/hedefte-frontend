"use client";

import { Heatmap } from "@/src/features/program/types";
import { useHeatmap } from "@/src/lib/queries/sessions/useHeatmap";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/react";
import clsx from "clsx";
import { eachDayOfInterval, format } from "date-fns";
import { tr } from "date-fns/locale";

export default function Page() {
  const { data: heatmap, isPending } = useHeatmap();

  if (isPending) {
    return <span>lsdfkjlsdkfj</span>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Çalışın Gardaş</h1>
      <HeatmapComp data={heatmap!} />
    </div>
  );
}

const getColor = (activity: {
  sessions: number;
  duration: number;
  questions: number;
}) => {
  // Weighted score combining sessions, duration (minutes), and questions
  // Tune weights as needed
  const score =
    activity.sessions * 1 + activity.duration * 0.02 + activity.questions * 0.5;

  if (score <= 0) return "bg-activity-0";
  if (score <= 2) return "bg-activity-1";
  if (score <= 4) return "bg-activity-2";
  if (score <= 6) return "bg-activity-3";
  return "bg-activity-4";
};

const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

interface HeatmapProps {
  data: Heatmap;
}

function HeatmapComp({ data }: HeatmapProps) {
  const start = new Date(2025, 6, 6); // 1 Temmuz 2025
  const end = new Date(2026, 5, 21); // 19 Haziran 2026

  const allDays = eachDayOfInterval({ start, end });

  // Haftalara ayır (hafta Pazartesi başlar, Pazar biter) ve başlangıç pad'leri ekle
  const weeks: {
    date: string;
    activity: { sessions: number; duration: number; questions: number };
  }[][] = [];
  let currentWeek: {
    date: string;
    activity: { sessions: number; duration: number; questions: number };
  }[] = [];

  // Başlangıç günü için pad hesapla (Pzt=1 -> 0 pad, Sal=2 -> 1 pad, ... Paz=0 -> 6 pad)
  const startDay = start.getDay(); // 0=Sun, 1=Mon, ...
  const leadingPad = (startDay + 6) % 7;
  for (let i = 0; i < leadingPad; i++) {
    currentWeek.push({
      date: `pad-${i}`,
      activity: { sessions: 0, duration: 0, questions: 0 },
    });
  }

  allDays.forEach((day) => {
    const dayString = format(day, "yyyy-MM-dd");
    const activity = data.data[dayString];

    const dayData = {
      date: dayString,
      activity: activity ?? { sessions: 0, duration: 0, questions: 0 },
    };
    currentWeek.push(dayData);

    // Haftayı Pazar gününde bitir (Mon-Sun)
    if (day.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Son haftayı 7 güne tamamla (gerekirse pad ekle)
  if (currentWeek.length) {
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: `pad-tail-${currentWeek.length}`,
        activity: { sessions: 0, duration: 0, questions: 0 },
      });
    }
    weeks.push(currentWeek);
  }

  // Haftalık ilk günlerden ay etiketleri (pad olmayan ilk güne göre) ve sadece ay değişiminde göster
  const monthLabels = weeks.map((week, idx) => {
    const realDay =
      week.find((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date)) ?? week[0];
    const month = /^\d{4}-\d{2}-\d{2}$/.test(realDay.date)
      ? format(new Date(realDay.date), "LLL", { locale: tr })
      : "";
    if (idx === 0) return month;
    const prevWeek = weeks[idx - 1];
    const prevRealDay =
      prevWeek.find((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date)) ?? prevWeek[0];
    const prevMonth = /^\d{4}-\d{2}-\d{2}$/.test(prevRealDay.date)
      ? format(new Date(prevRealDay.date), "LLL", { locale: tr })
      : "";
    return month !== prevMonth ? month : "";
  });

  return (
    <div className="flex">
      {/* Gün isimleri */}
      <div className="flex flex-col justify-end gap-1 mr-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="size-4 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end "
          >
            {day}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        {/* Üstte ay etiketleri */}
        <div className="grid grid-flow-col ">
          {monthLabels.map((month, i) => (
            <div
              key={i}
              className={clsx(
                "w-5 text-xs text-gray-500 dark:text-gray-400 text-center ",
                {},
              )}
            >
              {month}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex ">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1 mr-1 ">
              {week.map((day) => {
                const isExamDay =
                  day.date === "2026-06-20" || day.date === "2026-06-21";
                const formattedDate = format(new Date(day.date), "d LLLL ", {
                  locale: tr,
                });
                return (
                  <Tooltip
                    size="sm"
                    closeDelay={0}
                    delay={0}
                    content={
                      isExamDay ? (
                        <div className="p-2 text-center text-sm ">
                          <div className=" font-bold">Sınav Günü</div>
                          <div className="text-xs ">Başarılar!</div>
                        </div>
                      ) : (
                        <div className="p-2 space-y-1">
                          <div className="text-sm font-semibold text-center">
                            {formattedDate}
                          </div>
                          <div className="flex items-center justify-center gap-2 ">
                            <Chip
                              className="text-[0.6rem]"
                              size="sm"
                              color="success"
                              variant="dot"
                            >
                              {day.activity.sessions} oturum
                            </Chip>
                            <Chip
                              className="text-[0.6rem]"
                              size="sm"
                              color="warning"
                              variant="dot"
                            >
                              {day.activity.duration} dk
                            </Chip>
                            <Chip
                              className="text-[0.6rem]"
                              size="sm"
                              color="secondary"
                              variant="dot"
                            >
                              {day.activity.questions} soru
                            </Chip>
                          </div>
                        </div>
                      )
                    }
                  >
                    <div
                      key={day.date}
                      className={`size-4 rounded ${
                        isExamDay
                          ? "bg-red-600 dark:bg-red-700  "
                          : getColor(day.activity)
                      }`}
                    />
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

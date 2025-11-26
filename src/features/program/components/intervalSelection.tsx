"use client";

import { Button } from "@heroui/button";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";

interface IntervalSelectionProps {
  weekDays: Date[];
  weekDaysAction: (days: Date[]) => void;
}

export default function IntervalSelection({
  weekDays,
  weekDaysAction,
}: IntervalSelectionProps) {
  const [startDate, setStartDate] = useState(startOfDay(new Date()));

  // Haftalık günleri oluştur
  useEffect(() => {
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    const end = endOfWeek(startDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    weekDaysAction(days);
  }, [startDate]);

  const handlePrevWeek = () =>
    setStartDate((date) => subDays(startOfWeek(date, { weekStartsOn: 1 }), 7));
  const handleNextWeek = () =>
    setStartDate((date) => addDays(startOfWeek(date, { weekStartsOn: 1 }), 7));
  const handleToday = () => setStartDate(startOfDay(new Date()));

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 shadow-sm dark:border-slate-700 bg-neutral">
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          onPress={handlePrevWeek}
          className="h-9 w-9 bg-transparent dark:bg-transparent"
        >
          <ChevronsLeft className="h-4 w-4 text-secondary" />
        </Button>
        <div className="flex flex-col mx-2">
          <span className="text-sm font-medium text-secondary">
            Çalışma Aralığı
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-secondary">
              {weekDays.length > 0 &&
                format(weekDays[0], "d MMM", { locale: tr })}
            </span>
            <span className="text-secondary">-</span>
            <span className="text-lg font-bold text-secondary">
              {weekDays.length > 0 &&
                format(weekDays[6], "d MMM yyyy", { locale: tr })}
            </span>
          </div>
        </div>
        <Button
          onPress={handleNextWeek}
          className="h-9 w-9 bg-transparent dark:bg-transparent"
        >
          <ChevronsRight className="h-4 w-4 text-secondary" />
        </Button>
      </div>
      <Button color="primary" onPress={handleToday} variant="ghost">
        Bugüne Dön
      </Button>
    </div>
  );
}

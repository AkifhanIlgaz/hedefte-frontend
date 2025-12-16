"use client";

import { Button } from "@heroui/button";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface IntervalSelectionProps {
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  handleToday: () => void;
  weekDays: Date[];
}

export default function IntervalSelection({
  handlePrevWeek,
  handleNextWeek,
  handleToday,
  weekDays,
}: IntervalSelectionProps) {
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
      <Button color="primary" onPress={handleToday} variant="solid">
        Bugüne Dön
      </Button>
    </div>
  );
}

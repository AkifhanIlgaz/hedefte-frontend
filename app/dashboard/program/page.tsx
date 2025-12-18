"use client";

import DayCard from "@/src/features/program/components/dayCard";
import IntervalSelection from "@/src/features/program/components/intervalSelection";
import { useSessions } from "@/src/lib/queries/useSessions";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { useEffect, useState } from "react";

export default function Page() {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [weekStart, setWeekStart] = useState(
    startOfWeek(startDate, { weekStartsOn: 1 }),
  );
  const [weekEnd, setWeekEnd] = useState(
    endOfWeek(startDate, { weekStartsOn: 1 }),
  );
  useSessions(weekStart, weekEnd);
  useEffect(() => {
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    const end = endOfWeek(startDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    setWeekStart(start);
    setWeekEnd(end);
    setWeekDays(days);
  }, [startDate]);

  const handlePrevWeek = () =>
    setStartDate((date) => subDays(startOfWeek(date, { weekStartsOn: 1 }), 7));
  const handleNextWeek = () =>
    setStartDate((date) => addDays(startOfWeek(date, { weekStartsOn: 1 }), 7));
  const handleToday = () => setStartDate(startOfDay(new Date()));

  return (
    <div className="flex flex-col gap-6 ">
      <DashboardHeader
        title="Haftalık Çalışma Programım"
        description={
          "Hedeflerini belirle, ilerlemeni takip et ve başarıya ulaş."
        }
      />

      <IntervalSelection
        handleNextWeek={handleNextWeek}
        handlePrevWeek={handlePrevWeek}
        handleToday={handleToday}
        weekDays={weekDays}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 ">
        {weekDays.map((day) => (
          <DayCard key={day.toString()} date={day} />
        ))}
      </div>
    </div>
  );
}

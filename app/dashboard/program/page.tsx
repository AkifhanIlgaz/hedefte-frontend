"use client";

import DayCard from "@/src/features/program/components/dayCard";
import IntervalSelection from "@/src/features/program/components/intervalSelection";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { useState } from "react";

export default function Page() {
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <DashboardHeader
        title="Haftalık Çalışma Programım"
        description={
          "Hedeflerini belirle, ilerlemeni takip et ve başarıya ulaş."
        }
      />

      <IntervalSelection weekDays={weekDays} weekDaysAction={setWeekDays} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 auto-rows-auto-auto">
        {weekDays.map((day) => (
          <DayCard key={day.toString()} date={day} />
        ))}
      </div>
    </div>
  );
}

"use client";
import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import ActivityHeatmap from "@/src/features/program/components/activityHeatmap";
import DayCard from "@/src/features/program/components/dayCard";
import { useHeatmap } from "@/src/lib/queries/sessions/useHeatmap";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { ClipboardCheck, Hourglass, TrendingUp } from "lucide-react";

export default function DashboardHomePage() {
  const { data: heatmap, isPending } = useHeatmap();
  console.log(new Array(5)[0]);

  if (isPending) {
    return <span>lsdfkjlsdkfj</span>;
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <DashboardHeader
        title="Anasayfa"
        description="Genel bilgilerinizi gorebilirsiniz"
      />

      <div className="flex flex-col  gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GeneralAnalysisCard
            title="Günlük Çalışma Süresi"
            icon={ClipboardCheck}
            value={35 + ` dk`}
          />
          <GeneralAnalysisCard
            title="Günlük Çözülen Soru"
            icon={TrendingUp}
            value={77 + " soru"}
          />
          <GeneralAnalysisCard
            title="Current Streak"
            icon={Hourglass}
            value={35 + ` gün`}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DayCard date={new Date()} title="Günlük Programım" />
        <DayCard date={new Date()} title="Tamamladığım Oturumlar" />
      </div>

      <div className="flex items-center justify-center text-center">
        {heatmap && <ActivityHeatmap heatmap={heatmap} />}
      </div>
    </div>
  );
}

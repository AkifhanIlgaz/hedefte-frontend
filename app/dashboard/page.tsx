"use client";
import GeneralAnalysisCard from "@/src/features/analiz/components/cards/GeneralAnalysisCard";
import ActivityHeatmap from "@/src/features/program/components/activityHeatmap";
import DailyActivityCard from "@/src/features/program/components/dailyActivityCard";
import { Session } from "@/src/features/program/types";
import { useHeatmap } from "@/src/lib/queries/sessions/useHeatmap";
import { useSessionsOfDay } from "@/src/lib/queries/sessions/useSessions";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Spinner } from "@heroui/spinner";
import { Clock, FireExtinguisher, TrendingUp } from "lucide-react";
import { useMemo } from "react";

function emptyContentForNotCompletedSessions(
  completedSessions: Session[],
  notCompletedSessions: Session[],
) {
  const totalSessionCount =
    completedSessions.length + notCompletedSessions.length;

  if (totalSessionCount === 0) {
    return "Henuz oturum eklenmedi";
  }

  if (completedSessions.length == totalSessionCount) {
    return "eri lan ozgur";
  }
}

function emptyContentForCompletedSessions(
  completedSessions: Session[],
  notCompletedSessions: Session[],
) {
  const totalSessionCount =
    completedSessions.length + notCompletedSessions.length;

  if (totalSessionCount === 0) {
    return "Henuz oturum eklenmedi";
  }

  if (notCompletedSessions.length == totalSessionCount) {
    return "biraz calis dayi daha bisi yapmadin";
  }
}

export default function DashboardHomePage() {
  const { data: heatmap, isPending } = useHeatmap();
  const { data: sessions } = useSessionsOfDay(new Date());
  const todayData = heatmap?.activities[new Date().toISOString().split("T")[0]];

  const completedSessions = useMemo(() => {
    return sessions?.filter((session) => session.isCompleted) ?? [];
  }, [sessions]);

  const notCompletedSessions = useMemo(() => {
    return sessions?.filter((session) => !session.isCompleted) ?? [];
  }, [sessions]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Verileriniz yükleniyor. Lütfen bekleyin ..." />
      </div>
    );
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
            icon={Clock}
            value={todayData?.duration + ` dk`}
          />
          <GeneralAnalysisCard
            title="Bugün Çözülen Soru"
            icon={TrendingUp}
            value={todayData?.questions + " soru"}
          />
          <GeneralAnalysisCard
            title="Current Streak"
            icon={FireExtinguisher}
            value={heatmap?.currentStreak + ` gün`}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyActivityCard
          date={new Date()}
          title="Günlük Programım"
          sessions={notCompletedSessions}
          emptyContent={emptyContentForNotCompletedSessions(
            completedSessions,
            notCompletedSessions,
          )}
          isPending={isPending}
        />

        <DailyActivityCard
          date={new Date()}
          title="Tamamladığım Oturumlar"
          sessions={completedSessions}
          emptyContent={emptyContentForCompletedSessions(
            completedSessions,
            notCompletedSessions,
          )}
          isPending={isPending}
        />
      </div>

      <div className="flex items-center justify-center text-center">
        {heatmap && <ActivityHeatmap heatmap={heatmap} />}
      </div>
    </div>
  );
}

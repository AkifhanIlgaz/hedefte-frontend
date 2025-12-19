"use client";
import ActivityHeatmap from "@/src/features/program/components/activityHeatmap";
import { useHeatmap } from "@/src/lib/queries/sessions/useHeatmap";

export default function DashboardHomePage() {
  const { data: heatmap, isPending } = useHeatmap();
  console.log(new Array(5)[0]);

  if (isPending) {
    return <span>lsdfkjlsdkfj</span>;
  }

  return (
    <div className="flex flex-col items-start p-4">
      {heatmap && <ActivityHeatmap heatmap={heatmap} />}
    </div>
  );
}

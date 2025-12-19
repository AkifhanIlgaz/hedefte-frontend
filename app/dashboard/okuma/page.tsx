"use client";

import ActivityHeatmap from "@/src/features/program/components/activityHeatmap";
import { useHeatmap } from "@/src/lib/queries/sessions/useHeatmap";

export default function Page() {
  const { data: heatmap, isPending } = useHeatmap();

  if (isPending) {
    return <span>lsdfkjlsdkfj</span>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Çalışın Gardaş</h1>
      {heatmap && <ActivityHeatmap heatmap={heatmap} />}
    </div>
  );
}

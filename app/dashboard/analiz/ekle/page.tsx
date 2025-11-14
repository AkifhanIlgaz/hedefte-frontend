"use client";
import GeneralExamInfoCard from "@/src/features/analiz/components/ExamInfoCard";
import PerformanceAnalysisCard from "@/src/features/analiz/components/PerformanceAnalysisCard";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <GeneralExamInfoCard />
      <PerformanceAnalysisCard />
    </div>
  );
}

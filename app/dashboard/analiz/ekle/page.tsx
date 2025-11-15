"use client";
import GeneralExamInfoCard from "@/src/features/analiz/components/ExamInfoCard";
import PerformanceAnalysisCard from "@/src/features/analiz/components/PerformanceAnalysisCard";
import { Exam } from "@/src/features/analiz/types";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const exam = searchParams.get(`exam`) as Exam;

  return (
    <div className="flex flex-col gap-6">
      <GeneralExamInfoCard exam={exam} />
      <PerformanceAnalysisCard exam={exam} />
    </div>
  );
}

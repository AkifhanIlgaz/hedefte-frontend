"use client";
import GeneralExamInfoCard from "@/src/features/analiz/components/cards/GeneralExamInfoCard";
import PerformanceAnalysisCard from "@/src/features/analiz/components/cards/PerformanceAnalysisCard";
import {
  AddExamRequest,
  addExamSchema,
} from "@/src/features/analiz/schemas/add_exam.schema";
import { Exam } from "@/src/features/analiz/types";
import { defaultLessonsForExam } from "@/src/features/analiz/utils";
import { useAddExam } from "@/src/lib/queries/useAddExam";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

export default function Page() {
  const searchParams = useSearchParams();
  const exam = searchParams.get("exam") as Exam;
  const { mutateAsync } = useAddExam();

  const form = useForm({
    resolver: zodResolver(addExamSchema),
    defaultValues: {
      name: "",
      examType: exam,
      date: undefined,
      lessons: defaultLessonsForExam(exam),
    },
  });

  const submitHandler = form.handleSubmit(async (data: AddExamRequest) => {
    try {
      await mutateAsync(data);
      addToast({
        title: "Analiz başarıyla kaydedildi!",
        description: "Analiz başarıyla kaydedildi.",
        color: "success",
      });

      // TODO: analiz basariyla kaydedildiyse analytics e redirect et veya toast icinde button ekle
      // TODO: cache invalidate
      form.reset();
    } catch (error) {
      addToast({
        title: "Bir hata oluştu.",
        description:
          error instanceof Error
            ? error.message
            : "Beklenmedik bir hata ile karşılaştık.",
        color: "danger",
      });
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={submitHandler} className="flex flex-col gap-6">
        <DashboardHeader
          title="Deneme Analizi Ekle"
          description="Deneme sonuçlarını sisteme ekle, zayıf ve güçlü yönlerini keşfet."
        />

        <GeneralExamInfoCard exam={exam} />
        <PerformanceAnalysisCard exam={exam} onSubmit={submitHandler} />
      </form>
    </FormProvider>
  );
}

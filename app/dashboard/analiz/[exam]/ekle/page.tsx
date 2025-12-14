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
import { useRouter } from "next/navigation";
import { use } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function Page({
  params,
}: {
  params: Promise<{ exam: string }>;
}) {
  const { exam: encodedExam } = use(params);
  const exam = encodedExam.toUpperCase() as Exam;
  const { mutateAsync } = useAddExam();
  const router = useRouter();

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

      form.reset();
      router.push(`/dashboard/analiz/${exam.toLowerCase()}`);
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

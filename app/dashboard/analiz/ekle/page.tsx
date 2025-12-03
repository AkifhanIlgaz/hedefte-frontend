"use client";
import GeneralExamInfoCard from "@/src/features/analiz/components/cards/GeneralExamInfoCard";
import PerformanceAnalysisCard from "@/src/features/analiz/components/cards/PerformanceAnalysisCard";
import { GenericExamFormValues, getLessons } from "@/src/features/analiz/data";
import { getExamSchema } from "@/src/features/analiz/schemas/add_exam.schema";
import { Exam, TopicMistake } from "@/src/features/analiz/types";
import { Field } from "@/src/features/profil/types";
import { createClient } from "@/src/lib/supabase/client";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

export default function Page() {
  const searchParams = useSearchParams();
  const exam = searchParams.get(`exam`) as Exam;
  const field = searchParams.get(`field`) as Field;
  const lessons = getLessons(exam, field);
  const myschema = getExamSchema(exam, field);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = Object.fromEntries(
    Object.keys(lessons).map((lessonName) => [
      lessonName,
      {
        correct: 0,
        wrong: 0,
        empty: 0,
        time: 0,
        topicMistakes: [] as TopicMistake[],
      },
    ]),
  );
  if (!myschema) return <p>Loading schema...</p>;

  const form = useForm<GenericExamFormValues>({
    resolver: zodResolver(myschema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: z.infer<typeof myschema>) => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      const supabaseAccessToken = await supabase.auth
        .getSession()
        .then((res) => res.data.session?.access_token);

      if (!supabaseAccessToken) {
        throw new Error("Access token not found");
      }

      // Send POST request to /api/analysis
      const response = await fetch(
        "http://localhost:8080/api/analysis/" + exam.toLowerCase(),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to submit analysis: ${response.statusText}`);
      }

      // Handle success
      addToast({
        title: "Analiz başarıyla kaydedildi!",
        description: "Analiz başarıyla kaydedildi.",
        color: "success",
      });

      form.reset();
    } catch (error) {
      console.error(error);
      addToast({
        title: "Hata",
        description: "Analiz kaydedilirken bir hata oluştu.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log(form.getValues());

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <DashboardHeader
          title="Deneme Analizi Ekle"
          description="Deneme sonuçlarını sisteme ekle, zayıf ve güçlü yönlerini keşfet."
        />

        <GeneralExamInfoCard exam={exam} />
        <PerformanceAnalysisCard
          exam={exam}
          field={field}
          isLoading={isLoading}
        />
      </form>
    </FormProvider>
  );
}

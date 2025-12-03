"use client";
import GeneralExamInfoCard from "@/src/features/analiz/components/cards/GeneralExamInfoCard";
import PerformanceAnalysisCard from "@/src/features/analiz/components/cards/PerformanceAnalysisCard";
import { addSayExamSchema } from "@/src/features/analiz/schemas/add_exam.schema";
import { createClient } from "@/src/lib/supabase/client";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(addSayExamSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: z.infer<typeof addSayExamSchema>) => {
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
      const response = await fetch("http://localhost:8080/api/analysis/tyt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
        body: JSON.stringify(data),
      });

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

        <GeneralExamInfoCard exam={"AYT_SAY"} />
        <PerformanceAnalysisCard exam={"AYT_SAY"} isLoading={isLoading} />
      </form>
    </FormProvider>
  );
}

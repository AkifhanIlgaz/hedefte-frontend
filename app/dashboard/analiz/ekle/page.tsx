"use client";
import GeneralExamInfoCard from "@/src/features/analiz/components/GeneralExamInfoCard";
import PerformanceAnalysisCard from "@/src/features/analiz/components/PerformanceAnalysisCard";
import { getLessons } from "@/src/features/analiz/data";
import { getExamSchema } from "@/src/features/analiz/schemas/add_exam.schema";
import { Exam } from "@/src/features/analiz/types";
import { Field } from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toJSONSchema } from "zod";

export default function Page() {
  const searchParams = useSearchParams();
  const exam = searchParams.get(`exam`) as Exam;
  const field = searchParams.get(`field`) as Field;
  const lessons = getLessons(exam, field);
  const myschema = getExamSchema(exam, field);

  const defaultValues = Object.fromEntries(
    Object.keys(lessons).map((lessonName) => [
      lessonName,
      { correct: 0, wrong: 0, empty: 0, time: 0 },
    ]),
  );
  if (!myschema) return <p>Loading schema...</p>;

  const form = useForm({
    resolver: zodResolver(myschema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <GeneralExamInfoCard exam={exam} />
        <PerformanceAnalysisCard exam={exam} field={field} />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Save } from "lucide-react";
import { Field } from "../../profil/data";
import { getLessons } from "../data";
import { Exam } from "../types";
import LessonAccordion from "./LessonAccordion";

interface PerformanceAnalysisCardProps {
  exam: Exam;
  field: Field;
  isLoading: boolean;
}

export default function PerformanceAnalysisCard({
  exam,
  field,
  isLoading,
}: PerformanceAnalysisCardProps) {
  const lessons = getLessons(exam, field);

  return (
    <>
      <Card className="p-3">
        <CardHeader className="flex  items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-md font-bold">Net ve Konu Analizi</span>
            <span className="text-xs text-default-500">
              Derslere ait doğru, yanlış ve boş sayılarını girebilir, her
              konudan kaç yanlış yaptığını ekleyebilirsin.
            </span>
          </div>

          <Button type="submit" color="primary" isLoading={isLoading}>
            <Save className="size-4" />
            Denemeyi Kaydet
          </Button>
        </CardHeader>
        <CardBody className="gap-3">
          {Object.values(lessons).map((lesson) => (
            <LessonAccordion lesson={lesson} key={lesson.name} />
          ))}
        </CardBody>
      </Card>
    </>
  );
}

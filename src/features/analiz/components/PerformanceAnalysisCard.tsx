import { Card, CardHeader, CardBody } from "@heroui/card";
import { eaLessons, getLessons, tytLessons } from "../data";
import LessonAccordion from "./LessonAccordion";
import { Exam } from "../types";
import { Field } from "../../profil/data";

interface PerformanceAnalysisCardProps {
  exam: Exam;
  field: Field;
}

export default function PerformanceAnalysisCard({
  exam,
  field,
}: PerformanceAnalysisCardProps) {
  const lessons = getLessons(exam, field);

  return (
    <Card className="p-3">
      <CardHeader className="flex flex-col items-start">
        <span className="text-md font-bold">Net ve Konu Analizi</span>
        <span className="text-xs text-default-500">
          Derslere ait doğru, yanlış ve boş sayılarını girebilir, her konudan
          kaç yanlış yaptığını ekleyebilirsin.
        </span>
      </CardHeader>
      <CardBody className="gap-3">
        {Object.values(lessons).map((lesson) => (
          <LessonAccordion lesson={lesson} key={lesson.name} />
        ))}
      </CardBody>
    </Card>
  );
}

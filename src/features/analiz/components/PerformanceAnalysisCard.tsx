import { Card, CardHeader, CardBody } from "@heroui/card";
import { tytLessons } from "../data";
import LessonAccordion from "./LessonAccordion";

export default function PerformanceAnalysisCard() {
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
        {Object.values(tytLessons).map((lesson) => (
          <LessonAccordion lesson={lesson} key={lesson.name} />
        ))}
      </CardBody>
    </Card>
  );
}

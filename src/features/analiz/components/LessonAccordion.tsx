import { Accordion, AccordionItem } from "@heroui/accordion";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { Lesson } from "../types";
import NetInfoCard from "./NetInfoCard";
import TopicInfoCard from "./TopicInfoCard";

interface LessonAccordionProps {
  lesson: Lesson;
}

export default function LessonAccordion({ lesson }: LessonAccordionProps) {
  const form = useFormContext();
  const correct = form.watch(`${lesson.name}.correct`);
  const wrong = form.watch(`${lesson.name}.wrong`);
  const totalNet = (correct ?? 0) - (wrong ?? 0) * 0.25;

  const title = (
    <div className="flex items-center gap-3">
      <div className={clsx("p-2 rounded-full", lesson.bgClass)}>
        <lesson.icon className={clsx("size-4", lesson.iconColor)} />
      </div>
      <span className={clsx(`text-md`, lesson.iconColor)}>{lesson.name}</span>
      <span className={clsx(`text-md`, lesson.iconColor)}>
        {totalNet.toFixed(2)}
      </span>
    </div>
  );

  return (
    <Accordion variant="splitted" selectionMode="single" className=" ">
      <AccordionItem
        key="1"
        aria-label="Accordion 1"
        title={title}
        className="data-[open=true]:pb-4  "
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <NetInfoCard lessonName={lesson.name} />
          <TopicInfoCard topics={lesson.topics} lessonName={lesson.name} />
        </div>
      </AccordionItem>
    </Accordion>
  );
}

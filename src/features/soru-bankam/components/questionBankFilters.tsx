import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@heroui/react";
import { ChangeEvent, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  AytEaLessonNames,
  AytMfLessonNames,
  Exam,
  LessonName,
  TytLessonNames,
} from "../../analiz/types";
import { getTopics } from "../../program/utils";

interface QuestionBankFiltersProps {
  form: UseFormReturn<
    {
      exam: string;
      timeInterval: number;
      page: number;
      rowsPerPage: number;
      lesson?: string | undefined;
      topic?: string | undefined;
    },
    unknown,
    {
      exam: string;
      timeInterval: number;
      page: number;
      rowsPerPage: number;
      lesson?: string | undefined;
      topic?: string | undefined;
    }
  >;
  isFetching: boolean;
}

const EXAM_TYPES = ["TYT", "AYT_SAY", "AYT_EA"];

export default function QuestionBankFilters({
  form,
  isFetching,
}: QuestionBankFiltersProps) {
  const [lessonNames, setLessonNames] = useState<LessonName[]>([]);
  return (
    <form className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start ">
        <Select
          variant="faded"
          label="Sınav"
          labelPlacement="outside"
          isVirtualized
          selectionMode="single"
          disallowEmptySelection
          maxListboxHeight={80}
          isDisabled={isFetching}
          placeholder="Lütfen çalışacağınız sınavı seçiniz."
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            form.setValue("exam", e.target.value);

            switch (e.target.value) {
              case "TYT":
                setLessonNames([...TytLessonNames]);
                break;
              case "AYT":
                setLessonNames(
                  Array.from(
                    new Set([...AytEaLessonNames, ...AytMfLessonNames]),
                  ),
                );
                break;
              default:
                setLessonNames([]);
                break;
            }
            form.trigger("exam");
          }}
          errorMessage={form.formState.errors.exam?.message}
          isInvalid={!!form.formState.errors.exam}
        >
          {EXAM_TYPES.map((exam) => (
            <SelectItem key={exam}>{exam}</SelectItem>
          ))}
        </Select>
        <Select
          variant="faded"
          label="Ders"
          labelPlacement="outside"
          isVirtualized
          selectionMode="single"
          isDisabled={isFetching}
          placeholder="Lütfen çalışma yapacağınız dersi seçiniz."
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            form.setValue("lesson", e.target.value);
            form.trigger("lesson");
          }}
          errorMessage={form.formState.errors.lesson?.message}
          isInvalid={!!form.formState.errors.lesson}
        >
          {lessonNames.map((lesson) => (
            <SelectItem key={lesson}>{lesson}</SelectItem>
          ))}
        </Select>
        <Autocomplete
          variant="faded"
          label="Konu"
          labelPlacement="outside"
          isVirtualized
          isDisabled={isFetching}
          placeholder="Lütfen çalışma yapacağınız konuyu seçiniz."
          onSelectionChange={(key) => {
            form.setValue("topic", key as string);
            form.trigger("topic");
          }}
          errorMessage={form.formState.errors.topic?.message}
          isInvalid={!!form.formState.errors.topic}
        >
          {getTopics(
            form.watch("exam") as Exam | "AYT",
            form.watch("lesson") as LessonName,
          ).map((topic) => (
            <AutocompleteItem key={topic}>{topic}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Select
          label="Zaman Aralığı"
          labelPlacement="outside"
          selectionMode="single"
          defaultSelectedKeys={
            new Set([form.getValues("timeInterval").toString()])
          }
          onChange={(event) => {
            const selectedKey = parseInt(event.target.value);
            form.setValue("timeInterval", selectedKey);
            form.trigger("timeInterval");
          }}
          disallowEmptySelection={true}
          variant="faded"
        >
          <SelectItem key={"1"}>Son 1 Ay</SelectItem>
          <SelectItem key={"3"}>Son 3 Ay</SelectItem>
          <SelectItem key={"6"}>Son 6 Ay</SelectItem>
          <SelectItem key={"-1"}>Tüm Zamanlar</SelectItem>
        </Select>
      </div>
    </form>
  );
}

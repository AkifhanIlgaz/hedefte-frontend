"use client";

import {
  AytEaLessonNames,
  AytMfLessonNames,
  Exam,
  LessonName,
  TopicMistake,
  TytLessonNames,
} from "@/src/features/analiz/types";
import { getTopics } from "@/src/features/program/utils";
import { getTopicMistakesSchema } from "@/src/features/soru-bankam/schemas/get_topic_mistakes.schema";
import { useTopicMistakes } from "@/src/lib/queries/topicMistakes/useTopicMistakes";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Chip } from "@heroui/chip";
import { Modal, ModalBody, ModalContent } from "@heroui/modal";
import {
  Autocomplete,
  AutocompleteItem,
  Image,
  Select,
  SelectItem,
} from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

const EXAM_TYPES = ["TYT", "AYT_SAY", "AYT_EA"];

export default function Page() {
  const [lessonNames, setLessonNames] = useState<LessonName[]>([]);
  const [timeInterval, setTimeInterval] = useState(-1);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(getTopicMistakesSchema),
    defaultValues: {
      timeInterval,
    },
  });

  const [debouncedFilters] = useDebounce(form.watch(), 600);

  const {
    data: topicMistakes,
    isFetching,
    isFetched,
  } = useTopicMistakes(debouncedFilters);

  const columns = useMemo(
    () => [
      { key: "imageUrl", label: "Görsel" },
      { key: "date", label: "Tarih" },
      { key: "examType", label: "Sınav" },
      { key: "lesson", label: "Ders" },
      { key: "topic", label: "Konu" },
      { key: "correctAnswer", label: "Doğru" },
      { key: "isSolved", label: "Durum" },
    ],
    [],
  );

  const renderCell = useCallback((item: TopicMistake, columnKey: string) => {
    switch (columnKey) {
      case "date": {
        const formattedDate = new Intl.DateTimeFormat("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(item.date));
        return <span className="text-sm font-semibold">{formattedDate}</span>;
      }
      case "correctAnswer":
        return (
          <Chip size="sm" color="primary" className="font-semibold">
            {item.correctAnswer}
          </Chip>
        );
      case "isSolved":
        return (
          <Chip size="sm" color={item.isSolved ? "success" : "warning"}>
            {item.isSolved ? "Çözüldü" : "Çözülmedi"}
          </Chip>
        );
      case "imageUrl":
        return item.imageUrl ? (
          <div className="flex w-full justify-center">
            <button
              type="button"
              onClick={() => setSelectedImageUrl(item.imageUrl)}
              className="cursor-pointer"
            >
              <Image
                src={item.imageUrl}
                alt="Soru görseli"
                width={64}
                height={64}
                className="rounded-md"
              />
            </button>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <span className="text-default-400">Yok</span>
          </div>
        );
      default:
        const value = item[columnKey as keyof TopicMistake];
        return <span className="text-sm">{String(value ?? "")}</span>;
    }
  }, []);

  const loadingState = isFetching ? "loading" : "idle";

  const emptyContent = useMemo(() => {
    return (
      <div className="flex w-full flex-col items-center justify-end ">
        <CircleAlert className="size-6 text-danger" />
        <h2 className=" text-danger-500 font-semibold">
          Seçtiğiniz kriterler için soru bulunamadı !
        </h2>
      </div>
    );
  }, []);

  return (
    <div className="flex flex-col gap-6 ">
      <DashboardHeader
        title="Soru Bankam"
        description={
          "Yanlış yaptığın soruları konu ve derse göre listeleyebilirsin."
        }
      />
      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start ">
          <Select
            variant="bordered"
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
            variant="bordered"
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
            variant="bordered"
            label="Konu"
            labelPlacement="outside"
            isVirtualized
            isDisabled={isFetching}
            placeholder="Lütfen çalışma yapacağınız konuyu seçiniz."
            onSelectionChange={(value: Key | null) => {
              form.setValue("topic", value as string);
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
            label="Ders"
            labelPlacement="outside"
            selectionMode="single"
            defaultSelectedKeys={new Set([timeInterval.toString()])}
            onChange={(event) => {
              const selectedKey = parseInt(event.target.value);
              setTimeInterval(selectedKey);
              form.setValue("timeInterval", selectedKey);
              form.trigger("timeInterval");
            }}
            disallowEmptySelection={true}
            color="primary"
          >
            <SelectItem key={"1"}>Son 1 Ay</SelectItem>
            <SelectItem key={"3"}>Son 3 Ay</SelectItem>
            <SelectItem key={"6"}>Son 6 Ay</SelectItem>
            <SelectItem key={"-1"}>Tüm Zamanlar</SelectItem>
          </Select>
        </div>
      </form>
      <Table
        aria-label="Soru Bankam hata listesi"
        isCompact
        isHeaderSticky
        topContentPlacement="outside"
        className="max-w-screen"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align="center">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={topicMistakes ?? []}
          loadingContent={<Spinner />}
          emptyContent={emptyContent}
          loadingState={loadingState}
        >
          {(item: TopicMistake) => (
            <TableRow key={item.imageUrl}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={!!selectedImageUrl}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImageUrl(null);
          }
        }}
        size="3xl"
        placement="center"
      >
        <ModalContent>
          <ModalBody>
            {selectedImageUrl ? (
              <div className="flex w-full justify-center py-2">
                <Image
                  src={selectedImageUrl}
                  alt="Soru görseli"
                  className="max-h-[80vh] w-auto rounded-lg"
                />
              </div>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

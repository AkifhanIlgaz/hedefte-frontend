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
import SolveModal from "@/src/features/soru-bankam/components/solveModal";
import { getTopicMistakesSchema } from "@/src/features/soru-bankam/schemas/get_topic_mistakes.schema";
import { useTopicMistakes } from "@/src/lib/queries/topicMistakes/useTopicMistakes";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Image,
  Select,
  Selection,
  SelectItem,
  useDisclosure,
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
import {
  CheckCheck,
  CircleAlert,
  CircleChevronLeft,
  CircleChevronRight,
  CircleQuestionMark,
  LucideIcon,
  X,
} from "lucide-react";
import {
  ChangeEvent,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

const EXAM_TYPES = ["TYT", "AYT_SAY", "AYT_EA"];

const confidenceOptions: {
  [key: number]: {
    label: string;
    icon: LucideIcon;
    color:
      | "danger"
      | "warning"
      | "success"
      | "primary"
      | "secondary"
      | "default"
      | undefined;
  };
} = {
  0: { label: "Çözemedim", icon: X, color: "danger" },
  1: {
    label: "Arada Kaldım",
    icon: CircleQuestionMark,
    color: "warning",
  },
  2: { label: "Rahat Çözdüm", icon: CheckCheck, color: "success" },
};
export default function Page() {
  const [lessonNames, setLessonNames] = useState<LessonName[]>([]);
  const [timeInterval, setTimeInterval] = useState(-1);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const testModal = useDisclosure();
  const form = useForm({
    resolver: zodResolver(getTopicMistakesSchema),
    defaultValues: {
      timeInterval,
      page,
      rowsPerPage,
    },
  });

  const examValue = form.watch("exam");
  const lessonValue = form.watch("lesson");
  const topicValue = form.watch("topic");
  const timeIntervalValue = form.watch("timeInterval");
  const [debouncedFilters] = useDebounce(form.watch(), 250);

  const { data, isFetching } = useTopicMistakes(debouncedFilters);

  const keyForItem = useCallback((item: TopicMistake) => {
    return item.id ?? item.imageUrl;
  }, []);

  const selectedItems = useMemo(() => {
    if (selectedKeys === "all") {
      return data?.payload ?? [];
    }
    if (selectedKeys.size === 0) {
      return [];
    }
    return (data?.payload ?? []).filter((item) =>
      selectedKeys.has(keyForItem(item)),
    );
  }, [data?.payload, keyForItem, selectedKeys]);

  const columns = useMemo(
    () => [
      { key: "imageUrl", label: "Soru" },
      { key: "date", label: "Tarih" },
      { key: "examType", label: "Sınav" },
      { key: "lesson", label: "Ders" },
      { key: "topic", label: "Konu" },
      { key: "confidence", label: "Güven Skoru" },
      { key: "solve", label: "" },
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
      case "confidence":
        const options =
          confidenceOptions[item.confidence as keyof typeof confidenceOptions];

        return (
          <Chip
            size="sm"
            color={options.color}
            variant="bordered"
            startContent={<options.icon className="size-4" />}
          >
            {options.label}
          </Chip>
        );
      case "imageUrl":
        return (
          <div className="flex w-full justify-center">
            <Image
              src={item.imageUrl}
              alt="Soru görseli"
              width={64}
              height={64}
              className="rounded-md"
            />
          </div>
        );
      case "solve":
        return <SolveModal topicMistake={item} />;
      default:
        const value = item[columnKey as keyof TopicMistake];
        return <span className="text-sm">{String(value ?? "")}</span>;
    }
  }, []);

  const loadingState = isFetching ? "loading" : "idle";

  useEffect(() => {
    setPage(1);
    form.setValue("page", 1);
  }, [examValue, lessonValue, topicValue, timeIntervalValue, form]);

  useEffect(() => {
    setSelectedKeys(new Set());
    setCurrentTestIndex(0);
    setShowAnswer(false);
  }, [data?.payload]);

  useEffect(() => {
    if (!testModal.isOpen) {
      setShowAnswer(false);
    }
  }, [testModal.isOpen]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          label="Sayfa Başına"
          labelPlacement="outside"
          selectionMode="single"
          isDisabled={isFetching}
          className="w-full sm:max-w-45"
          selectedKeys={new Set([String(rowsPerPage)])}
          onChange={(event) => {
            const selectedValue = parseInt(event.target.value, 10);
            setRowsPerPage(selectedValue);
            setPage(1);
            form.setValue("rowsPerPage", selectedValue);
            form.setValue("page", 1);
            form.trigger("rowsPerPage");
          }}
          variant="faded"
        >
          <SelectItem key="2">2</SelectItem>
          <SelectItem key="10">10</SelectItem>
          <SelectItem key="20">20</SelectItem>
          <SelectItem key="50">50</SelectItem>
        </Select>
        <Button
          color="primary"
          variant="shadow"
          className="w-full sm:w-auto"
          isDisabled={selectedItems.length === 0}
          onPress={() => {
            setCurrentTestIndex(0);
            setShowAnswer(false);
            testModal.onOpen();
          }}
        >
          Test Oluştur
        </Button>
      </div>
    );
  }, [form, isFetching, rowsPerPage, selectedItems.length, testModal.onOpen]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={data?.meta?.totalPages ?? 0}
          onChange={(nextPage) => {
            setPage(nextPage);
            form.setValue("page", nextPage);
            form.trigger("page");
          }}
        />
      </div>
    );
  }, [data?.meta?.totalPages, form, page]);

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
            label="Zaman Aralığı"
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
            variant="faded"
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
        isStriped
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        topContentPlacement="outside"
        topContent={topContent}
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
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
          items={data?.payload ?? []}
          loadingContent={<Spinner />}
          emptyContent={emptyContent}
          loadingState={loadingState}
        >
          {(item: TopicMistake) => (
            <TableRow key={keyForItem(item)}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={testModal.isOpen}
        onOpenChange={testModal.onOpenChange}
        size="full"
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Test</ModalHeader>
          <ModalBody>
            <div className="relative flex h-full w-full items-center justify-center">
              {selectedItems[currentTestIndex]?.imageUrl ? (
                <Image
                  src={selectedItems[currentTestIndex].imageUrl}
                  alt="Soru görseli"
                  className="max-h-[80vh] w-auto rounded-lg"
                />
              ) : (
                <span className="text-default-400">Görsel bulunamadı</span>
              )}
              {selectedItems.length > 1 && (
                <>
                  <Button
                    isIconOnly
                    className="absolute left-2 top-1/2 -translate-y-1/2"
                    variant="faded"
                    onPress={() => {
                      const idx =
                        (currentTestIndex - 1 + selectedItems.length) %
                        selectedItems.length;
                      setCurrentTestIndex(idx);
                      setShowAnswer(false);
                    }}
                  >
                    <CircleChevronLeft />
                  </Button>
                  <Button
                    isIconOnly
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    variant="faded"
                    onPress={() => {
                      const idx = (currentTestIndex + 1) % selectedItems.length;
                      setCurrentTestIndex(idx);
                      setShowAnswer(false);
                    }}
                  >
                    <CircleChevronRight />
                  </Button>
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-center">
            {showAnswer ? (
              <span className="text-sm font-semibold text-success">
                Cevap: {selectedItems[currentTestIndex]?.correctAnswer ?? "-"}
              </span>
            ) : (
              <Button
                color="success"
                variant="shadow"
                onPress={() => setShowAnswer(true)}
              >
                Cevabı Göster
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

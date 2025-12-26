import {
  Chip,
  Image,
  Pagination,
  Select,
  Selection,
  SelectItem,
  Spinner,
} from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  CheckCheck,
  CircleAlert,
  CircleQuestionMark,
  LucideIcon,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { GeneralResponse, TopicMistake } from "../../analiz/types";
import DeleteModal from "./deleteModal";
import SolveModal from "./solveModal";

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

interface TopicMistakesTableProps {
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
  data: GeneralResponse<TopicMistake[]> | undefined;
}

export default function TopicMistakesTable({
  form,
  isFetching,
  data,
}: TopicMistakesTableProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const exam = form.watch("exam");
  const lesson = form.watch("lesson");
  const topic = form.watch("topic");
  const rowsPerPage = form.watch("rowsPerPage");
  const page = form.watch("page");
  const timeInterval = form.watch("timeInterval");

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
        return (
          <div className="flex gap-2 items-center justify-center">
            <SolveModal topicMistake={item} />
            <DeleteModal id={item.id ?? ""} />
          </div>
        );
      default:
        const value = item[columnKey as keyof TopicMistake];
        return <span className="text-sm">{String(value ?? "")}</span>;
    }
  }, []);

  const loadingState = isFetching ? "loading" : "idle";

  useEffect(() => {
    form.setValue("page", 1);
  }, [exam, lesson, topic, timeInterval, form]);

  useEffect(() => {
    setSelectedKeys(new Set());
  }, [data?.payload]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Select
          label="Sayfa Başına"
          labelPlacement="outside"
          selectionMode="single"
          isDisabled={isFetching}
          className="w-full sm:max-w-45"
          selectedKeys={new Set([String(rowsPerPage)])}
          onChange={(event) => {
            const selectedValue = parseInt(event.target.value, 10);

            form.setValue("rowsPerPage", selectedValue);
            form.setValue("page", 1);
            form.trigger("rowsPerPage");
          }}
          variant="faded"
        >
          <SelectItem key="5">5</SelectItem>
          <SelectItem key="10">10</SelectItem>
          <SelectItem key="20">20</SelectItem>
          <SelectItem key="50">50</SelectItem>
        </Select>
      </div>
    );
  }, [form, isFetching, rowsPerPage, selectedItems.length]);

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
  );
}

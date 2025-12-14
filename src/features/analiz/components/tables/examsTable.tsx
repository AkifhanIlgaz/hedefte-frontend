import { useDeleteExam } from "@/src/lib/queries/useDeleteExam";
import { useExams } from "@/src/lib/queries/useExams";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { addToast } from "@heroui/toast";
import { CircleAlert, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Exam, ExamResponse } from "../../types";
import { getTableColumns } from "../../utils";

interface ExamsTableProps {
  exam: Exam;
  timeInterval: number;
}

export default function ExamsTable({ exam, timeInterval }: ExamsTableProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, isError } = useExams({
    exam: exam,
    page,
    rowsPerPage,
    timeInterval,
  });
  const { mutateAsync: deleteExam, isPending: isDeleting } =
    useDeleteExam(exam);

  const handleDeleteExam = async (examId: string) => {
    addToast({
      title: "Lütfen bekleyin !",
      description: "Sınav siliniyor.",
      color: "warning",
      endContent: <Spinner size="sm" color="warning" />,
    });

    try {
      await deleteExam(examId);
      addToast({
        title: "İşlem Başarılı !",
        description: "Sınav başarıyla silindi.",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "İşlem Başarısız !",
        description: "Sınav silinirken bir hata oluştu.",
        color: "danger",
      });
    }
  };

  const loadingState = isLoading ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.meta?.total ? Math.ceil(data.meta.total / rowsPerPage) : 0;
  }, [data?.meta?.total, rowsPerPage]);

  const columns = getTableColumns(exam);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pages}
          total={data?.meta?.totalPages ?? 0}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, []);

  const emptyContent = useMemo(() => {
    return (
      <div className="flex w-full flex-col items-center justify-end ">
        <CircleAlert className="size-6 text-danger" />
        <h2 className=" text-danger-500 font-semibold">
          Seçtiğiniz zaman aralığı için bir deneme analizi bulunamadı !
        </h2>
      </div>
    );
  }, []);

  const renderCell = useCallback(
    (exam: ExamResponse, columnKey: keyof ExamResponse | "actions") => {
      if (columnKey.startsWith("lesson:")) {
        const lessonName = columnKey.replace("lesson:", "");
        const lesson = exam.lessons.find((l) => l.name === lessonName);

        const value = lesson?.result ?? 0;

        return (
          <Chip
            size="sm"
            variant="dot"
            className="font-semibold"
            color="primary"
          >
            {value.toFixed(2)}
          </Chip>
        );
      }
      switch (columnKey) {
        case "date":
          const formattedDate = new Intl.DateTimeFormat("tr-TR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(exam.date));
          return <span className="text-md font-bold">{formattedDate}</span>;
        case "name":
          return <span className="text-md font-bold">{exam.name}</span>;
        case "result":
          return (
            <Chip
              color="primary"
              classNames={{
                content: "font-bold",
              }}
            >
              {exam.result.toFixed(2)}
            </Chip>
          );
        case "actions":
          return (
            <Button
              color="danger"
              size="sm"
              variant="bordered"
              aria-label="Denemeyi sil"
              startContent={<Trash2 className="size-3" />}
              className="flex "
              disabled={isDeleting}
              isLoading={isDeleting}
              onPress={() => {
                handleDeleteExam(exam.id);
              }}
            >
              {isDeleting ? "Siliniyor..." : "Sil"}
            </Button>
          );
        case "lessons":
          return (
            <div className="flex flex-wrap gap-1">
              {exam.lessons.map((lesson) => (
                <Chip
                  key={lesson.name}
                  size="sm"
                  variant="flat"
                  color={lesson.result > 0 ? "primary" : "default"}
                >
                  {lesson.name}: {lesson.result}
                </Chip>
              ))}
            </div>
          );
        default:
          return null;
      }
    },
    [],
  );

  return (
    <Table
      aria-label="Example table with client async pagination"
      isCompact
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
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
        items={data?.payload ?? []}
        loadingContent={<Spinner />}
        emptyContent={emptyContent}
        loadingState={loadingState}
        className="max-w-screen"
      >
        {(item: ExamResponse) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof ExamResponse | "actions")}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

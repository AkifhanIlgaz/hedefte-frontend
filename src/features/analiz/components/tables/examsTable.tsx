import { Field } from "@/src/features/profil/types";
import { useExams } from "@/src/queries/useExams";
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
import { CircleAlert } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Exam } from "../../types";
import { getTableColumns } from "../../utils";

interface ExamsTableProps {
  exam: Exam;
  field?: Field;
  timeInterval: number;
}

export default function ExamsTable({
  exam,
  field,
  timeInterval,
}: ExamsTableProps) {
  const columns = getTableColumns(exam, field);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, isError } = useExams({
    exam: exam,
    page,
    rowsPerPage,
    timeInterval,
  });
  const loadingState = isLoading ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.meta.total ? Math.ceil(data.meta.total / rowsPerPage) : 0;
  }, [data?.meta.total, rowsPerPage]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pages}
          total={data?.meta.totalPages}
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

  const renderCell = useCallback((exam: any, columnKey: any) => {
    const cellValue = exam[columnKey];
    switch (columnKey) {
      case "date":
        const formattedDate = new Intl.DateTimeFormat("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(cellValue));
        return <span className="text-md font-bold">{formattedDate}</span>;
      case "name":
        return <span className="text-md font-bold">{cellValue}</span>;
      case "totalNet":
        return (
          <Chip
            color="primary"
            classNames={{
              content: "font-bold",
            }}
          >
            {cellValue.toFixed(2)}
          </Chip>
        );

      default:
        return (
          <span className="text-xs font-semibold">
            {cellValue?.net.toFixed(2)}
          </span>
        );
    }
  }, []);

  console.log(data);

  return (
    <Table
      aria-label="Example table with client async pagination"
      isCompact
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      isHeaderSticky
      topContentPlacement="outside"
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
        {(item: any) => (
          <TableRow key={item.name}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

"use client";

import { useTYTExams } from "@/src/queries/useTytExams";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
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
import { TytLessonNames } from "../types";

const columns = [
  { key: "name", label: "İsim" },
  { key: "date", label: "Tarih" },
  ...TytLessonNames.map((lessonName) => ({
    key: lessonName,
    label: lessonName,
  })),
  { key: "totalNet", label: "Toplam Net" },
];

export default function TYTExamsTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [timeInterval, setTimeInterval] = useState(1);

  const { data, isLoading, isError } = useTYTExams({
    page,
    rowsPerPage,
    timeInterval,
  });
  const loadingState = isLoading ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.meta.total ? Math.ceil(data.meta.total / rowsPerPage) : 0;
  }, [data?.meta.total, rowsPerPage]);

  const renderCell = useCallback((exam: any, columnKey: any) => {
    const cellValue = exam[columnKey];
    switch (columnKey) {
      case "Tarih":
      case "Türkçe":
      case "Matematik":
      case "Coğrafya":
      case "Felsefe":
      case "Din Kültürü":
      case "Fizik":
      case "Kimya":
      case "Biyoloji":
        return (
          <span className="text-xs font-semibold">
            {cellValue.net.toFixed(2)}
          </span>
        );

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
        return null;
    }
  }, []);

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

  const topContent = useMemo(() => {
    return (
      <div className="flex w-full items-end justify-end gap-2">
        <Select
          size="sm"
          className="max-w-xs"
          selectionMode="single"
          defaultSelectedKeys={new Set([rowsPerPage.toString()])}
          onChange={(event) => {
            const selectedKey = parseInt(event.target.value);
            setRowsPerPage(selectedKey);
          }}
          disallowEmptySelection={true}
        >
          <SelectItem key={"10"}>Sayfa başı 10 deneme</SelectItem>
          <SelectItem key={"20"}>Sayfa başı 20 deneme</SelectItem>
          <SelectItem key={"50"}>Sayfa başı 50 deneme</SelectItem>
          <SelectItem key={"100"}>Sayfa başı 100 deneme</SelectItem>
        </Select>
        <Select
          size="sm"
          className="max-w-xs"
          selectionMode="single"
          defaultSelectedKeys={new Set([timeInterval.toString()])}
          onChange={(event) => {
            const selectedKey = parseInt(event.target.value);
            setTimeInterval(selectedKey);
          }}
          disallowEmptySelection={true}
        >
          <SelectItem key={"1"}>Son 1 Ay</SelectItem>
          <SelectItem key={"3"}>Son 3 Ay</SelectItem>
          <SelectItem key={"6"}>Son 6 Ay</SelectItem>
          <SelectItem key={"-1"}>Tüm Zamanlar</SelectItem>
        </Select>
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

  return (
    <Table
      aria-label="Example table with client async pagination"
      isCompact
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
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

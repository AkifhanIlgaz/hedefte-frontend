"use client";

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
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { TytLessonNames } from "../types";
import { buildPaginationUrl, fetcher } from "../utils";

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
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [timeInterval, setTimeInterval] = useState(1);

  const url = buildPaginationUrl("http://localhost:8080/api/analysis/tyt", {
    page: page,
    rowsPerPage: rowsPerPage,
    interval: 1, // monthly || -1 means all
  });

  const { data, isLoading, error } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  const loadingState =
    isLoading || data?.payload.length === 0 ? "loading" : "idle";

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
        return cellValue.net.toFixed(2);

      case "date":
        const formattedDate = new Intl.DateTimeFormat("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(cellValue));
        return formattedDate;
      case "name":
      case "totalNet":
        return cellValue;

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
          page={page}
          total={data?.meta.totalPages}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex w-full items-end justify-end">
        <Select
          size="sm"
          className="max-w-2xs"
          selectionMode="single"
          selectedKeys={new Set([timeInterval.toString()])}
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

  return (
    <Table
      aria-label="Example table with client async pagination"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={data?.payload ?? []}
        loadingContent={<Spinner />}
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

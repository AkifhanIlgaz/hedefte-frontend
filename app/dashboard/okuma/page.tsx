"use client";

import { useTYTExams } from "@/src/queries/useTytExams";

export default function Page() {
  const { data, isLoading, isError } = useTYTExams({
    page: 1,
    rowsPerPage: 10,
    timeInterval: -1,
  });
  return <span>Okuma</span>;
}

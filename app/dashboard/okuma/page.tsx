"use client";

import { fetcher } from "@/src/features/analiz/utils";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analysis-tyt", "1", "10", "-1"],
    queryFn: () =>
      fetcher(
        `http://localhost:8080/api/analysis/tyt?page=1&rowsPerPage=10&timeInterval=-1`,
      ),
  });
  return <span>Okuma</span>;
}

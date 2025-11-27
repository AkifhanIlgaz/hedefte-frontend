import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GeneralResponse } from "../features/analiz/types";
import { fetcher } from "../features/analiz/utils";
import { Session } from "../features/program/types";

interface UseSessionsParams {
  date: Date;
}

export const useSessions = ({ date }: UseSessionsParams) => {
  const queryClient = useQueryClient();
  const formattedDate = date.toISOString();

  const { data, isLoading, isError } = useQuery<GeneralResponse<Session[]>>({
    queryKey: ["sessions", formattedDate],
    queryFn: () =>
      fetcher(`sessions/${formattedDate}`) as Promise<
        GeneralResponse<Session[]>
      >,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });

  if (!data?.success) {
    return { sessions: [] as Session[], isLoading, isError };
  }

  return {
    sessions: data.payload ?? [],
    isLoading,
    isError,
  };
};

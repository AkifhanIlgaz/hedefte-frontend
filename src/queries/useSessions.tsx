import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GeneralResponse, Session } from "../features/analiz/types";
import { fetcher } from "../features/analiz/utils";

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

  console.log(data);
  const addSessionToCache = (newSession: Session) => {
    queryClient.setQueryData<GeneralResponse<Session[]>>(
      ["sessions", formattedDate],
      (oldData) => {
        if (!oldData?.success) return oldData;
        return {
          ...oldData,
          payload: [...(oldData.payload ?? []), newSession],
        };
      },
    );
  };
  if (!data?.success) {
    return { sessions: [] as Session[], isLoading, isError, addSessionToCache };
  }

  return {
    sessions: data.payload ?? [],
    isLoading,
    isError,
    addSessionToCache,
  };
};

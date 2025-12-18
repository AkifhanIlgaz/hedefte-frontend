import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import sessionService, {
  SessionsOfInterval,
} from "../../services/sessionService";

export function useDeleteSession(date: Date) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionService.deleteSession(id),
    onSuccess: (_data, deletedId) => {
      const start = startOfWeek(date, { weekStartsOn: 1 }).toISOString();
      const end = endOfWeek(date, { weekStartsOn: 1 }).toISOString();

      queryClient.setQueryData<SessionsOfInterval[] | undefined>(
        ["sessions", start, end],
        (prev) =>
          prev?.map((interval) => ({
            ...interval,
            sessions: interval.sessions.filter(
              (session) => session.id !== deletedId,
            ),
          })),
      );

      void queryClient.invalidateQueries({
        queryKey: ["sessions", start, end],
      });
    },
  });
}

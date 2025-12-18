import { CompleteSessionRequest } from "@/src/features/program/schemas/complete_session.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import sessionService from "../../services/sessionService";

export function useCompleteSession(date: Date) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CompleteSessionRequest) =>
      sessionService.completeSession(req),

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "sessions",
          startOfWeek(date, { weekStartsOn: 1 }).toISOString(),
          endOfWeek(date, { weekStartsOn: 1 }).toISOString(),
        ],
      });
    },
  });
}

import { AddSessionRequest } from "@/src/features/program/schemas/add_session.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import sessionService from "../../services/sessionService";

export function useAddSession(date: Date) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AddSessionRequest) => sessionService.addSession(req),
    onSuccess: async () => {
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

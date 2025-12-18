import { UpdateSessionRequest } from "@/src/features/program/schemas/update_session.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import sessionService from "../../services/sessionService";

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: UpdateSessionRequest) =>
      sessionService.updateSession(req),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          "sessions",
          startOfWeek(data.date, { weekStartsOn: 1 }).toISOString(),
          endOfWeek(data.date, { weekStartsOn: 1 }).toISOString(),
        ],
      });
    },
  });
}

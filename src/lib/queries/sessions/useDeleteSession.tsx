import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import sessionService from "../../services/sessionService";

export function useDeleteSession(date: Date) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sessionService.deleteSession(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          "sessions",
          startOfWeek(date, { weekStartsOn: 1 }).toISOString(),
          endOfWeek(date, { weekStartsOn: 1 }).toISOString(),
        ],
      });
    },
  });
}

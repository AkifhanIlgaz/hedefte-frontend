import { AddSessionRequest } from "@/src/features/program/schemas/add_session.schema";
import { CompleteSessionRequest } from "@/src/features/program/schemas/complete_session.schema";
import { UpdateSessionRequest } from "@/src/features/program/schemas/update_session.schema";
import { toDateKey } from "@/src/features/program/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import sessionService, { SessionsOfInterval } from "../services/sessionService";

export const useSessions = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["sessions", startDate.toISOString(), endDate.toISOString()],
    queryFn: () =>
      sessionService.getSessions(
        startDate.toISOString(),
        endDate.toISOString(),
      ),
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 day
  });
};

export const useSessionsOfDay = (day: Date, startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["sessions", startDate.toISOString(), endDate.toISOString()],
    queryFn: () =>
      sessionService.getSessions(
        startDate.toISOString(),
        endDate.toISOString(),
      ),
    select: (data: SessionsOfInterval[]) => {
      return (
        data.find((d) => toDateKey(d.date) == toDateKey(day))?.sessions ?? []
      );
    },

    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 day
  });
};

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

export function useCompleteSession(date: Date) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CompleteSessionRequest) =>
      sessionService.completeSession(req),

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

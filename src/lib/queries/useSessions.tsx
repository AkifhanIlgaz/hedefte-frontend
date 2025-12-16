import { toDateKey } from "@/src/features/program/utils";
import { useQuery } from "@tanstack/react-query";
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

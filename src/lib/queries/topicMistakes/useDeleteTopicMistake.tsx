import { GeneralResponse, TopicMistake } from "@/src/features/analiz/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import topicMistakeService from "../../services/topicMistakeService";

export default function useDeleteTopicMistake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => topicMistakeService.delete(id),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: ["topic-mistakes"] },
        (oldData: GeneralResponse<TopicMistake[]> | undefined) => {
          if (!oldData?.payload?.length) {
            return oldData;
          }

          return {
            ...oldData,
            payload: oldData.payload.filter((item) => item.id !== deletedId),
          };
        },
      );
    },
  });
}

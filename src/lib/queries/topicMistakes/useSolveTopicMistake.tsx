import { GeneralResponse, TopicMistake } from "@/src/features/analiz/types";
import { SolveTopicMistakeRequest } from "@/src/features/soru-bankam/schemas/solve_topic_mistake.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import topicMistakeService from "../../services/topicMistakeService";

export default function useAskTopicMistake() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: SolveTopicMistakeRequest) =>
      topicMistakeService.solve(req),
    onSuccess: (_data, variables) => {
      queryClient.setQueriesData(
        { queryKey: ["topic-mistakes"] },
        (oldData: GeneralResponse<TopicMistake[]> | undefined) => {
          if (!oldData?.payload?.length) {
            return oldData;
          }

          return {
            ...oldData,
            payload: oldData.payload.map((item) =>
              item.id === variables.id
                ? { ...item, confidence: variables.confidence }
                : item,
            ),
          };
        },
      );
    },
  });
}

import { GetTopicMistakesRequest } from "@/src/features/soru-bankam/schemas/get_topic_mistakes.schema";
import { useQuery } from "@tanstack/react-query";
import topicMistakeService from "../../services/topicMistakeService";

export const useTopicMistakes = (req: Partial<GetTopicMistakesRequest>) => {
  return useQuery({
    queryKey: ["topic-mistakes", req],
    queryFn: () =>
      topicMistakeService.getTopicMistakes(req as GetTopicMistakesRequest),
    enabled: Boolean(req.exam),
  });
};

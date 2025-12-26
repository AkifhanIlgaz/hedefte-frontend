"use client";

import QuestionBankFilters from "@/src/features/soru-bankam/components/questionBankFilters";
import TopicMistakesTable from "@/src/features/soru-bankam/components/topicMistakesTable";
import { getTopicMistakesSchema } from "@/src/features/soru-bankam/schemas/get_topic_mistakes.schema";
import { useTopicMistakes } from "@/src/lib/queries/topicMistakes/useTopicMistakes";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

export default function Page() {
  const form = useForm({
    resolver: zodResolver(getTopicMistakesSchema),
    defaultValues: {
      timeInterval: -1,
      page: 1,
      rowsPerPage: 10,
    },
  });

  const [debouncedFilters] = useDebounce(form.watch(), 250);
  const { data, isFetching } = useTopicMistakes(debouncedFilters);

  return (
    <div className="flex flex-col gap-6 ">
      <DashboardHeader
        title="Soru Bankam"
        description={
          "Yanlış yaptığın soruları konu ve derse göre listeleyebilirsin."
        }
      />
      <QuestionBankFilters form={form} isFetching={isFetching} />
      <TopicMistakesTable form={form} data={data} isFetching={isFetching} />
    </div>
  );
}

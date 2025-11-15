import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import { addToast, NumberInput } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { LessonName, TopicMistake } from "../types";
import { useFieldArray, useFormContext } from "react-hook-form";

interface TopicInfoCardProps {
  topics: string[];
  lessonName: LessonName;
}

export default function TopicInfoCard({
  topics,
  lessonName,
}: TopicInfoCardProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [mistakesCount, setMistakesCount] = useState<number>(1);
  const form = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: `${lessonName}.topicMistakes`, // path dikkat
  });

  const typedFields = fields as (TopicMistake & { id: string })[];

  const wrong = form.watch(`${lessonName}.wrong`) as number;
  const empty = form.watch(`${lessonName}.empty`) as number;

  return (
    <>
      <Card className="p-3">
        <CardHeader className="flex flex-col items-center justify-center ">
          {(() => {
            const totalMistakes = typedFields.reduce(
              (acc, curr) => acc + curr.mistakeCount,
              0,
            );
            const totalWrongEmpty = wrong + empty;
            const isComplete =
              totalMistakes >= totalWrongEmpty && totalWrongEmpty > 0;

            return (
              <>
                <CircularProgress
                  classNames={{
                    svg: "w-36 h-36 drop-shadow-md",
                    indicator: isComplete
                      ? "stroke-success"
                      : "stroke-black dark:stroke-white",
                    track: isComplete
                      ? "stroke-success/10"
                      : "stroke-black/10 dark:stroke-white/10",
                    value:
                      "text-2xl font-semibold " +
                      (isComplete
                        ? "text-success"
                        : "text-black dark:text-white"),
                  }}
                  showValueLabel={true}
                  strokeWidth={2}
                  value={
                    totalWrongEmpty > 0
                      ? (totalMistakes / totalWrongEmpty) * 100
                      : 0
                  }
                  valueLabel={`${totalMistakes}/${totalWrongEmpty}`}
                />
                <span className="text-xs text-muted-foreground ">
                  Yanlış/Boş girilen soru sayısı
                </span>
              </>
            );
          })()}
        </CardHeader>

        <CardBody className="flex items-center justify-end gap-4">
          <Select
            variant="bordered"
            label="Konu"
            labelPlacement="outside"
            isVirtualized
            selectionMode="single"
            selectedKeys={new Set([selectedTopic])}
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
          >
            {topics.map((topic) => (
              <SelectItem key={topic}>{topic}</SelectItem>
            ))}
          </Select>
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              onPress={() => setMistakesCount((prev) => prev - 1)}
            >
              <Minus />
            </Button>
            <NumberInput
              hideStepper
              size="sm"
              radius="full"
              variant="bordered"
              minValue={1}
              value={mistakesCount}
              onValueChange={setMistakesCount}
              classNames={{
                label: "text-xs",
                input: "text-center",
              }}
            />
            <Button
              isIconOnly
              onPress={() => setMistakesCount((prev) => prev + 1)}
            >
              <Plus />
            </Button>
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex flex-col gap-4 w-full">
            <Button
              color="primary"
              onPress={() => {
                if (selectedTopic == undefined || mistakesCount == undefined) {
                  addToast({
                    title: "Bir hata oluştu !",
                    description: "Lütfen konuyu ve yanlış sayısını seçiniz.",
                    color: "danger",
                  });
                  return;
                }

                const idx = typedFields.findIndex(
                  (field) => field.topicName === selectedTopic,
                );

                if (idx === -1) {
                  append({
                    topicName: selectedTopic,
                    mistakeCount: mistakesCount,
                  });
                  setSelectedTopic("");
                  setMistakesCount(1);
                  return;
                }

                const f = typedFields[idx];

                f.mistakeCount += mistakesCount;

                update(idx, f);
                setSelectedTopic("");
                setMistakesCount(1);
              }}
            >
              Ekle
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card className="p-3  ">
        <CardBody className="flex gap-3 overflow-x-hidden">
          <AnimatePresence initial={false}>
            {typedFields
              .toSorted((a, b) => b.mistakeCount - a.mistakeCount)
              .map((field, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  key={field.id}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="
              w-full flex items-center justify-between
              rounded-xl border
              px-3 py-2
              text-sm
              bg-danger-50 dark:bg-danger-50
              border-danger-400/60 dark:border-danger-400/60
              shadow-sm
              "
                    >
                      <span className="opacity-80 font-bold">
                        {field.topicName}
                      </span>
                      <span className="text-danger text-xs font-medium">
                        {field.mistakeCount} yanlış
                      </span>
                    </div>
                    <Button
                      isIconOnly
                      variant="shadow"
                      color="danger"
                      size="sm"
                      onPress={() => {
                        const idx = typedFields.findIndex(
                          (field) => field.topicName === selectedTopic,
                        );
                        remove(idx);
                      }}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </CardBody>
      </Card>
    </>
  );
}

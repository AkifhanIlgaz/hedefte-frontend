import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import { addToast, NumberInput } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { TopicMistake } from "../types";

interface TopicInfoCardProps {
  topics: string[];
}

export default function TopicInfoCard({ topics }: TopicInfoCardProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [topicMistakes, setTopicMistakes] = useState<Array<TopicMistake>>([]);

  return (
    <>
      <Card className="p-3 max-h-fit">
        <CardHeader className="flex items-center justify-center">
          <CircularProgress
            classNames={{
              svg: "w-36 h-36 drop-shadow-md",
              indicator: "stroke-black dark:stroke-white",
              track: "stroke-black/10 dark:stroke-white/10",
              value: "text-3xl font-semibold text-black dark:text-white",
            }}
            showValueLabel={true}
            strokeWidth={2}
            value={60}
          />
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
              minValue={0}
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
                setTopicMistakes((prev) => [
                  ...prev,
                  {
                    topicName: selectedTopic,
                    mistakeCount: mistakesCount,
                  },
                ]);
                setSelectedTopic("");
                setMistakesCount(0);
              }}
            >
              Ekle
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card className="p-3 h-full ">
        <CardBody className="flex gap-3 overflow-x-hidden">
          <AnimatePresence initial={false}>
            {topicMistakes.map((topicMistake, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                key={idx}
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
                      {topicMistake.topicName}
                    </span>
                    <span className="text-danger text-xs font-medium">
                      {topicMistake.mistakeCount} yanlış
                    </span>
                  </div>
                  <Button
                    isIconOnly
                    variant="shadow"
                    color="danger"
                    size="sm"
                    onPress={() => {
                      setTopicMistakes(
                        topicMistakes.filter(
                          (tm) => tm.topicName !== topicMistake.topicName,
                        ),
                      );
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

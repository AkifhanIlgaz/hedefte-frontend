"use client";

import useSolveTopicMistake from "@/src/lib/queries/topicMistakes/useSolveTopicMistake";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Chip, Slider } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import {
  CheckCheck,
  CircleQuestionMark,
  Maximize2,
  NotebookPen,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TopicMistake } from "../../analiz/types";
import {
  SolveTopicMistakeRequest,
  solveTopicMistakeSchema,
} from "../schemas/solve_topic_mistake.schema";

const confidenceMarks = [
  {
    value: 0,
    label: (
      <Chip
        color="danger"
        size="sm"
        variant="bordered"
        startContent={<X className="size-4" />}
      >
        Çözemedim
      </Chip>
    ),
  },
  {
    value: 1,
    label: (
      <Chip
        color="warning"
        size="sm"
        variant="bordered"
        startContent={<CircleQuestionMark className="size-4" />}
      >
        Arada Kaldım
      </Chip>
    ),
  },
  {
    value: 2,
    label: (
      <Chip
        color="success"
        size="sm"
        variant="bordered"
        startContent={<CheckCheck className="size-4" />}
      >
        Rahatça Çözdüm
      </Chip>
    ),
  },
];

const confidenceFeedback = {
  0: {
    title: "Çözemedim",
    description: "Biraz daha gayret; bir dahaki sefere olacak.",
    color: "danger",
  },
  1: {
    title: "Arada Kaldım",
    description: "Fena değil; biraz daha tekrar ile netleşir.",
    color: "warning",
  },
  2: {
    title: "Rahatça Çözdüm",
    description: "Helal olsun; aynen devam!",
    color: "success",
  },
} as const;

interface SolveModalProps {
  topicMistake: TopicMistake;
}

export default function SolveModal({ topicMistake }: SolveModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onOpenChange: onImageOpenChange,
  } = useDisclosure();
  const [showAnswer, setShowAnswer] = useState(false);

  const form = useForm({
    resolver: zodResolver(solveTopicMistakeSchema),
    defaultValues: {
      id: topicMistake.id ?? ``,
      confidence: topicMistake.confidence,
    },
  });

  const { mutateAsync: solveTopicMistake, isPending } = useSolveTopicMistake();

  const confidence = form.watch("confidence");
  const initialConfidence = topicMistake.confidence;
  const isConfidenceChanged = confidence !== initialConfidence;
  const confidenceColor =
    confidence === 0 ? "danger" : confidence === 1 ? "warning" : "success";

  const resetFormState = () => {
    form.reset({
      id: topicMistake.id ?? "",
      confidence: topicMistake.confidence,
    });
    setShowAnswer(false);
  };

  const handleModalOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetFormState();
    }
    onOpenChange();
  };

  const handleSubmit = async (data: SolveTopicMistakeRequest) => {
    try {
      await solveTopicMistake(data);
      onClose();
      const feedback =
        confidenceFeedback[
          (data.confidence ?? confidence) as keyof typeof confidenceFeedback
        ];
      addToast({
        title: feedback.title,
        description: feedback.description,
        color: feedback.color,
      });
    } catch (error) {}
  };

  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<NotebookPen className="size-4" />}
        onPress={onOpen}
      >
        Soruyu Çöz
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleModalOpenChange}
        size="3xl"
        placement="center"
        className="p-3"
      >
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="relative flex w-full justify-center py-2">
                    <button type="button" onClick={onImageOpen}>
                      <Image
                        src={topicMistake.imageUrl}
                        alt="Soru görseli"
                        className="w-auto rounded-lg"
                      />
                    </button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="faded"
                      aria-label="Tam ekran görüntüle"
                      className="absolute left-2 top-2 z-10"
                      onPress={onImageOpen}
                    >
                      <Maximize2 className="size-4" />
                    </Button>
                  </div>

                  <Slider
                    minValue={0}
                    maxValue={2}
                    step={1}
                    hideValue
                    aria-label="Güven Skoru"
                    value={confidence}
                    onChange={(value) =>
                      form.setValue("confidence", value as number)
                    }
                    showSteps
                    // @ts-expect-error HeroUI types don't accept JSX labels for marks.
                    marks={confidenceMarks}
                    color={confidenceColor}
                    className="max-w-3xl px-6"
                    classNames={{
                      mark: "text-xs font-bold text-nowrap",
                      label: "text-xs font-bold ",
                    }}
                  />

                  <div className="flex flex-col items-center justify-center gap-2 mt-4">
                    <span
                      className={clsx("text-lg font-bold text-success", {
                        hidden: !showAnswer,
                      })}
                    >
                      Cevap: {topicMistake.correctAnswer ?? "-"}
                    </span>

                    <Button
                      color="success"
                      variant="ghost"
                      size="sm"
                      onPress={() => setShowAnswer((prev) => !prev)}
                    >
                      {showAnswer ? "Cevabı Gizle" : "Cevabı Göster"}
                    </Button>
                  </div>
                </ModalBody>
                <ModalFooter className="flex items-center">
                  <Button
                    color="danger"
                    onPress={() => {
                      resetFormState();
                      onClose();
                    }}
                  >
                    İptal
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isDisabled={!isConfidenceChanged}
                    isLoading={isPending}
                  >
                    Kaydet
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>

      <Modal
        isOpen={isImageOpen}
        onOpenChange={onImageOpenChange}
        size="full"
        placement="center"
      >
        <ModalContent className="overflow-auto">
          <ModalBody>
            <div className="flex w-full h-full justify-center py-2">
              <Image
                src={topicMistake.imageUrl}
                alt="Soru görseli"
                className="h-full w-full  rounded-lg object-contain"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onImageOpenChange}>
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

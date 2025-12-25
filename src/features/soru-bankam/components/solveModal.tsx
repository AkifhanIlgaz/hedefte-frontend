"use client";

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
import { clsx } from "clsx";
import {
  CheckCheck,
  CircleQuestionMark,
  Maximize2,
  NotebookPen,
  X,
} from "lucide-react";
import { useState } from "react";
import { TopicMistake } from "../../analiz/types";

interface SolveModalProps {
  topicMistake: TopicMistake;
}

export default function SolveModal({ topicMistake }: SolveModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onOpenChange: onImageOpenChange,
  } = useDisclosure();
  const [showAnswer, setShowAnswer] = useState(false);
  const [confidence, setConfidence] = useState(1);
  const confidenceColor =
    confidence === 0 ? "danger" : confidence === 1 ? "warning" : "success";
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
        onOpenChange={onOpenChange}
        size="3xl"
        placement="center"
        className="p-3"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {topicMistake.imageUrl ? (
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
                ) : null}

                <Slider
                  minValue={0}
                  maxValue={2}
                  step={1}
                  hideValue
                  aria-label="Güven Skoru"
                  value={confidence}
                  onChange={(value) => setConfidence(value as number)}
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
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  İptal
                </Button>
                <Button color="primary" onPress={onClose}>
                  Kaydet
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isImageOpen}
        onOpenChange={onImageOpenChange}
        size="full"
        placement="center"
      >
        <ModalContent>
          <ModalBody>
            {topicMistake.imageUrl ? (
              <div className="flex w-full h-full justify-center py-2">
                <Image
                  src={topicMistake.imageUrl}
                  alt="Soru görseli"
                  className="h-full w-full rounded-lg object-contain"
                />
              </div>
            ) : null}
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

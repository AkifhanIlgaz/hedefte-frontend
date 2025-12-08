"use client";

import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import {
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { CircleChevronLeft, CircleChevronRight, ZapIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LessonName, TopicMistake } from "../../types";

interface TopicInfoCardProps {
  topics: string[];
  lessonName: LessonName;
}

export default function TopicInfoCard({
  topics,
  lessonName,
}: TopicInfoCardProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const myModal = useDisclosure();

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `${lessonName}.topicMistakes`,
  });

  const wrong = form.watch(`${lessonName}.wrong`) as number;
  const empty = form.watch(`${lessonName}.empty`) as number;
  const topicMistakes = form.watch(
    `${lessonName}.topicMistakes`,
  ) as TopicMistake[];
  const topicMistakesByTopic = topicMistakes.reduce(
    (acc, mistake) => {
      if (!mistake.topicName) return acc;
      acc[mistake.topicName] = (acc[mistake.topicName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleImagesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const supabase = createClient();
    const bucket = supabase.storage.from("hg");

    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;
    if (!userId) return;

    try {
      await Promise.all(
        files.map(async (file) => {
          const fileName = `${userId}/${crypto.randomUUID()}`;
          const { error } = await bucket.upload(fileName, file, {
            upsert: true,
            contentType: file.type,
          });
          if (error) {
            console.error(error);
            return;
          }
          const { data } = supabase.storage.from("hg").getPublicUrl(fileName);

          append({
            imageUrl: data.publicUrl,
            filePath: fileName,
            topicName: "",
          });
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    remove(index);
  };

  const handleAIGuess = () => {
    setIsGuessing(true);

    // TODO: Implement AI guess logic
  };

  const handleNextImage = () => {
    console.log("next image");
    console.log("current index: ", currentImageIndex);
    if (topicMistakes.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % topicMistakes.length);
  };

  const handlePrevImage = () => {
    console.log("prev image");
    console.log("current index: ", currentImageIndex);
    if (topicMistakes.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + topicMistakes.length) % topicMistakes.length,
    );
  };

  return (
    <>
      <Card className="p-3 ">
        <CardBody className="flex flex-col items-center justify-center gap-2">
          {(() => {
            const totalMistakes = fields.length;
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
                <span className="text-xs text-muted-foreground">
                  Yanlış/Boş girilen soru sayısı
                </span>
                <span className="text-xs text-default-500">
                  Yüklenen görsel: {topicMistakes.length}
                </span>
              </>
            );
          })()}
        </CardBody>
        <CardFooter className="flex flex-col gap-2 items-end justify-end">
          <Button as="label" className="w-full" color="primary">
            <input
              type="file"
              className="sr-only"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              onChange={handleImagesSelected}
            />
            Soru Yükle
          </Button>
          <Button
            className="w-full"
            color="primary"
            onPress={myModal.onOpen}
            isDisabled={topicMistakes.length === 0}
          >
            Konulari Sec
          </Button>
        </CardFooter>
      </Card>

      <Card className="p-3" id={`topic-selection-${lessonName}`}>
        <CardBody className="flex flex-col gap-4 items-center justify-center ">
          {Object.keys(topicMistakesByTopic).length === 0 ? (
            <div>bir sey eklemedi</div>
          ) : (
            <div>
              {Object.entries(topicMistakesByTopic).map(
                ([topicName, count], index) => (
                  <div key={index}>{`${topicName}: ${count}`}</div>
                ),
              )}
            </div>
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-center gap-2"></CardFooter>
      </Card>

      <Modal
        isOpen={myModal.isOpen}
        onOpenChange={myModal.onOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>Konu Seçimi</ModalHeader>
          <ModalBody>
            {topicMistakes.length === 0 ? (
              <div className="w-full h-full *:rounded-xl border border-dashed border-default-300/70 py-6 text-center text-sm text-default-500">
                Henüz hiçbir soru kaydetmedin. Yüklediğin soruları
                kaydettiğinden emin ol.
              </div>
            ) : isUploading ? (
              <CircularProgress color="primary" label="Sorular Yükleniyor..." />
            ) : (
              <div className="relative w-full ">
                <Card isFooterBlurred className="h-80 overflow-hidden">
                  <Image
                    removeWrapper
                    className="z-0 h-full w-full object-center"
                    src={topicMistakes[currentImageIndex].imageUrl}
                  />
                  <CardFooter className="absolute bottom-0 z-10 flex w-full items-center justify-between bg-black/40 px-3 py-2">
                    <span className="text-xs font-semibold text-white line-clamp-1">
                      {topicMistakes[currentImageIndex].topicName}
                    </span>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => handleRemoveImage(currentImageIndex)}
                    >
                      Sil
                    </Button>
                  </CardFooter>
                </Card>
                {topicMistakes.length > 1 && (
                  <>
                    <Button
                      isIconOnly
                      className="absolute left-2 top-1/2 -translate-y-1/2 "
                      variant="faded"
                      onPress={handlePrevImage}
                    >
                      <CircleChevronLeft />
                    </Button>
                    <Button
                      isIconOnly
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      variant="faded"
                      onPress={handleNextImage}
                    >
                      <CircleChevronRight />
                    </Button>
                  </>
                )}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Select
              variant="bordered"
              labelPlacement="outside"
              isDisabled={topics.length === 0}
              selectionMode="single"
              disabled={isGuessing}
              endContent={
                <Button
                  isIconOnly
                  content="Yucci'ye sor"
                  className="bg-transparent"
                  onPress={handleAIGuess}
                  endContent={<ZapIcon className="size-5" />}
                />
              }
              selectedKeys={
                selectedTopic ? new Set([selectedTopic]) : new Set<string>()
              }
              onChange={(e) => {
                topicMistakes[currentImageIndex].topicName = e.target.value;

                setSelectedTopic(e.target.value);
              }}
              isLoading={isGuessing}
              placeholder="Lütfen yanlış yaptığınız konuyu seçiniz."
            >
              {topics.map((topic) => (
                <SelectItem key={topic}>{topic}</SelectItem>
              ))}
            </Select>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

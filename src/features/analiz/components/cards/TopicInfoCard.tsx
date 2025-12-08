"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import { Image } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { CircleChevronLeft, CircleChevronRight, ZapIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
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
  const [selectedImages, setSelectedImages] = useState<
    { id: string; name: string; src: string }[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const form = useFormContext();

  const { fields } = useFieldArray({
    control: form.control,
    name: `${lessonName}.topicMistakes`,
  });

  const typedFields = fields as (TopicMistake & { id: string })[];

  const wrong = form.watch(`${lessonName}.wrong`) as number;
  const empty = form.watch(`${lessonName}.empty`) as number;

  const generateImageId = () => {
    if (
      typeof globalThis.crypto !== "undefined" &&
      typeof globalThis.crypto.randomUUID === "function"
    ) {
      return globalThis.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const handleImagesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImages((prev) => [
          ...prev,
          {
            id: generateImageId(),
            name: file.name,
            src: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((image) => image.id !== id));
  };

  const handleAIGuess = () => {
    setIsGuessing(true);
    if (selectedImages.length === 0) return;
    const image = selectedImages[currentImageIndex];
    // TODO: Implement AI guess logic
  };

  useEffect(() => {
    if (selectedImages.length === 0) {
      setCurrentImageIndex(0);
      return;
    }

    setCurrentImageIndex((prev) => Math.min(prev, selectedImages.length - 1));
  }, [selectedImages.length]);

  const handleNextImage = () => {
    if (selectedImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const handlePrevImage = () => {
    if (selectedImages.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + selectedImages.length) % selectedImages.length,
    );
  };

  return (
    <>
      <Card className="p-3">
        <CardHeader className="flex flex-col items-center justify-center gap-2">
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
                <span className="text-xs text-muted-foreground">
                  Yanlış/Boş girilen soru sayısı
                </span>
                <span className="text-xs text-default-500">
                  Yüklenen görsel: {selectedImages.length}
                </span>
              </>
            );
          })()}
        </CardHeader>

        <CardFooter>
          <Button as="label" className="w-full" color="primary">
            <input
              type="file"
              className="sr-only"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              onChange={handleImagesSelected}
            />
            Görsel Yükle
          </Button>
        </CardFooter>
      </Card>

      <Card className="p-3" id={`topic-selection-${lessonName}`}>
        <CardBody className="flex flex-col gap-4 ">
          {selectedImages.length === 0 ? (
            <div className="w-full h-full *:rounded-xl border border-dashed border-default-300/70 py-6 text-center text-sm text-default-500">
              Henüz görsel yüklenmedi. Lütfen yukarıdaki butondan görsel
              ekleyin.
            </div>
          ) : (
            <div className="relative w-full ">
              <Card isFooterBlurred className="h-80 overflow-hidden">
                <div> </div>
                <Image
                  removeWrapper
                  alt={`${selectedImages[currentImageIndex].name} önizleme`}
                  className="z-0 h-full w-full object-cover"
                  src={selectedImages[currentImageIndex].src}
                />
                <CardFooter className="absolute bottom-0 z-10 flex w-full items-center justify-between bg-black/40 px-3 py-2">
                  <span className="text-xs font-semibold text-white line-clamp-1">
                    {selectedImages[currentImageIndex].name}
                  </span>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    onPress={() =>
                      handleRemoveImage(selectedImages[currentImageIndex].id)
                    }
                  >
                    Sil
                  </Button>
                </CardFooter>
              </Card>
              {selectedImages.length > 1 && (
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
        </CardBody>
        <CardFooter className="flex items-center justify-center gap-2">
          <Select
            variant="bordered"
            labelPlacement="outside"
            isDisabled={topics.length === 0}
            label="Konu Seçiniz"
            selectionMode="single"
            disabled={isGuessing}
            endContent={
              <Button
                isIconOnly
                className="bg-transparent"
                onPress={handleAIGuess}
                endContent={<ZapIcon className="size-5" />}
              />
            }
            selectedKeys={
              selectedTopic ? new Set([selectedTopic]) : new Set<string>()
            }
            onChange={(e) => setSelectedTopic(e.target.value)}
            isLoading={isGuessing}
            placeholder="Lütfen yanlış yaptığınız konuyu seçiniz."
          >
            {topics.map((topic) => (
              <SelectItem key={topic}>{topic}</SelectItem>
            ))}
          </Select>
        </CardFooter>
      </Card>
    </>
  );
}

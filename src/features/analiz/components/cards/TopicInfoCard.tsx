"use client";

import useAskTopicMistake from "@/src/lib/queries/topicMistakes/useAskTopicMistake";
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
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import {
  AlertCircle,
  CircleChevronLeft,
  CircleChevronRight,
  Info,
  Sparkle,
} from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LessonName, TopicMistake } from "../../types";

interface TopicInfoCardProps {
  topics: string[];
  lessonName: LessonName;
}

function sanitizeFilename(str: string) {
  const map: Record<string, string> = {
    ç: "c",
    Ç: "C",
    ğ: "g",
    Ğ: "G",
    ü: "u",
    Ü: "U",
    ö: "o",
    Ö: "O",
    ş: "s",
    Ş: "S",
    ı: "i",
    İ: "I",
  };

  return str.replace(/ç|Ç|ğ|Ğ|ü|Ü|ö|Ö|ş|Ş|ı|İ/g, (match) => map[match]);
}

export default function TopicInfoCard({
  topics,
  lessonName,
}: TopicInfoCardProps) {
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const myModal = useDisclosure();

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const form = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: `lessons.${lessonName}.topicMistakes`,
  });

  const wrong = form.watch(`lessons.${lessonName}.wrong`) as number;
  const empty = form.watch(`lessons.${lessonName}.empty`) as number;
  const topicMistakes =
    (form.watch(`lessons.${lessonName}.topicMistakes`) as TopicMistake[]) ?? [];
  const topicMistakesByTopic = topicMistakes.reduce(
    (acc, mistake) => {
      if (!mistake.topic) return acc;
      acc[mistake.topic] = (acc[mistake.topic] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topicMistakeEntries = Object.entries(topicMistakesByTopic).sort(
    (a, b) => b[1] - a[1],
  );
  const hasTopicMistakes = topicMistakeEntries.length > 0;

  const { mutateAsync: askTopicMistake, isPending } = useAskTopicMistake();

  const radioOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  const handleImagesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      setIsUploading(false);
      return;
    }

    const acceptedMimeTypes = ["image/jpeg", "image/png"];
    const validFiles = files.filter(
      (file) =>
        file.size <= MAX_FILE_SIZE && acceptedMimeTypes.includes(file.type),
    );

    if (validFiles.length === 0) {
      addToast({
        title: "Uyarı",
        description:
          "Sadece JPG/PNG ve 3 MB altındaki dosyaları yükleyebilirsin.",
        color: "warning",
      });
      setIsUploading(false);
      return;
    }

    const supabase = createClient();
    const bucket = supabase.storage.from("hg");

    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;
    if (!userId) {
      addToast({
        title: "Hata",
        description: "Giriş yapmadan görsel yükleyemezsin.",
        color: "danger",
      });
      setIsUploading(false);
      return;
    }

    try {
      await Promise.all(
        validFiles.map(async (file) => {
          const fileName = `${userId}/${sanitizeFilename(file.name)}`;
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
            lesson: lessonName,
            date: form.getValues("date"),
            topic: "",
          });
        }),
      );
      addToast({
        title: "Başarılı",
        description: "Sorular yüklendi. Konu seçimini yapabilirsin.",
        color: "success",
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: "Hata",
        description:
          "Görseller yüklenirken bir sorun oluştu. Lütfen tekrar dene.",
        color: "danger",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const topicMistakeToRemove = topicMistakes[index];
    const supabase = createClient();
    const bucket = supabase.storage.from("hg");

    try {
      const { error } = await bucket.remove([topicMistakeToRemove.filePath]);
      if (error) throw error;

      remove(index);
      setCurrentImageIndex((prev) => (prev + 1) % topicMistakes.length);
      addToast({
        title: "Başarılı",
        description: "Soru görseli silindi.",
        color: "success",
      });
    } catch (error: any) {
      console.error(error);
      addToast({
        title: "Hata",
        description:
          error?.message ||
          "Görsel silinirken bir sorun oluştu. Lütfen tekrar deneyin.",
        color: "danger",
      });
    }
  };

  const handleAIGuess = async () => {
    try {
      const topicMistake = topicMistakes[currentImageIndex];

      if (!topicMistake) return;

      const data = await askTopicMistake({
        exam: form.getValues("examType"),
        lesson: topicMistake.lesson,
        imageUrl: topicMistake.imageUrl,
      });

      update(currentImageIndex, {
        ...topicMistake,
        topic: data.topic,
      });
      setSelectedTopic(data.topic);

      addToast({
        title: "Başarılı !",
        description: `Bugünlük ${data.quota.dailyRemaining} hakkınız kaldı. ${data.quota.hoursUntilReset} saat sonra yeniden 100 kullanım hakkınız sıfırlanacaktır.`,
        color: "success",
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "AI tahmin ederken bir sorun oluştu. Lütfen tekrar deneyin.";
      addToast({
        title: "Hata",
        description: errorMessage,
        color: "danger",
      });
    }
  };

  const handleNextImage = () => {
    if (topicMistakes.length === 0) return;
    const idx = (currentImageIndex + 1) % topicMistakes.length;
    setSelectedTopic(topicMistakes[idx].topic);
    setCurrentImageIndex((prev) => (prev + 1) % topicMistakes.length);
  };

  const handlePrevImage = () => {
    if (topicMistakes.length === 0) return;
    const idx =
      (currentImageIndex - 1 + topicMistakes.length) % topicMistakes.length;
    setSelectedTopic(topicMistakes[idx].topic);
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
        <CardFooter className="flex flex-col gap-2 items-start justify-center">
          <div className="flex gap-2 items-center ">
            <Info className="size-4 text-default-500" />
            <p className="w-full text-start text-[11px] text-default-500">
              .jpg/.jpeg/.png uzantılı ve maksimum 3 MB boyutunda dosyalar
              desteklenir.
            </p>
          </div>
          <Button
            as="label"
            className="w-full"
            color="primary"
            isLoading={isUploading}
          >
            <input
              type="file"
              className="sr-only"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              size={MAX_FILE_SIZE}
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
        <CardBody
          className={
            hasTopicMistakes
              ? "flex flex-col gap-3 items-start justify-start"
              : "flex flex-col items-center justify-center"
          }
        >
          {topicMistakeEntries.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-default-100 text-danger">
                <AlertCircle className="h-6 w-6 text-danger" />
              </span>
              <p className="text-sm font-semibold text-default-700">
                Henüz konu seçilmedi
              </p>
              <p className="text-xs text-default-500">
                Yanlış yaptığın soruların konuları burada listelenecek.
              </p>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-3">
              {topicMistakeEntries.map(([topic, count]) => (
                <div
                  key={topic}
                  className="flex items-center justify-between rounded-xl border border-default-200/80 bg-default-50 px-3 py-3 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-default-800">
                      {topic}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger-600">
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={myModal.isOpen}
        onOpenChange={myModal.onOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>Konu Seçimi</ModalHeader>
          <ModalBody>
            <div className="relative w-full ">
              <Card isFooterBlurred className="h-80 overflow-hidden">
                <Image
                  removeWrapper
                  className="z-0 h-full w-full object-center"
                  src={topicMistakes[currentImageIndex]?.imageUrl}
                />
                {topicMistakes[currentImageIndex]?.topic && (
                  <CardFooter className="absolute bottom-0 z-10 flex w-full items-center justify-center px-3 py-2">
                    <span className="text-xs font-semibold text-white line-clamp-1">
                      {topicMistakes[currentImageIndex].topic}
                    </span>
                  </CardFooter>
                )}
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
          </ModalBody>

          <ModalFooter className="flex flex-col gap-3">
            <div className="flex w-full items-center justify-between  ">
              <Button
                size="sm"
                color="danger"
                onPress={() => handleRemoveImage(currentImageIndex)}
              >
                Sil
              </Button>
              <Tooltip
                content="Yucci soru-konu analizi için özel olarak geliştirdiğimiz bir yapay zeka modeli"
                className="text-xs"
              >
                <Button
                  size="sm"
                  color="primary"
                  className="text-xs"
                  onPress={handleAIGuess}
                  isDisabled={isPending}
                  endContent={<Sparkle className="size-4" />}
                >
                  bi' abine sor
                </Button>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Select
                variant="bordered"
                aria-label="Konu seçin"
                isDisabled={topics.length === 0}
                selectionMode="single"
                disabled={isPending}
                selectedKeys={
                  selectedTopic ? new Set([selectedTopic]) : new Set<string>()
                }
                onChange={(e) => {
                  topicMistakes[currentImageIndex].topic = e.target.value;
                  setSelectedTopic(e.target.value);
                }}
                isLoading={isPending}
                placeholder="Lütfen yanlış yaptığınız konuyu seçiniz."
              >
                {topics.map((topic) => (
                  <SelectItem key={topic}>{topic}</SelectItem>
                ))}
              </Select>
              <RadioGroup
                value={form.watch(
                  `lessons.${lessonName}.topicMistakes.${currentImageIndex}.correctAnswer`,
                )}
                onChange={(e) => {
                  e.preventDefault();
                  update(currentImageIndex, {
                    ...topicMistakes[currentImageIndex],
                    correctAnswer: e.target.value,
                  });
                }}
                orientation="horizontal"
                color="success"
                classNames={{
                  wrapper: "gap-3",
                }}
              >
                {radioOptions.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

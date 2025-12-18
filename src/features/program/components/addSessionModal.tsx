"use client";

import { useAddSession } from "@/src/lib/queries/useSessions";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ChangeEvent, Key, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AytEaLessonNames,
  AytMfLessonNames,
  Exam,
  LessonName,
  TytLessonNames,
} from "../../analiz/types";
import {
  AddSessionRequest,
  addSessionSchema,
} from "../schemas/add_session.schema";
import { getTopics } from "../utils";

const EXAM_TYPES = ["TYT", "AYT"];
const STUDY_TYPES = [
  "Konu Çalışması",
  "Soru Çözümü",
  "Deneme Sınavı",
  "Video İzleme",
  "Özet Çıkarma",
];

interface AddSessionModalProps {
  date: Date;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function AddSessionModal({
  date,
  isOpen,
  onOpenChange,
}: AddSessionModalProps) {
  const [lessonNames, setLessonNames] = useState<LessonName[]>([]);
  const form = useForm<AddSessionRequest>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: {
      date: date,
      isCompleted: false,
    },
  });

  const { mutateAsync, isPending } = useAddSession(date);

  const handleSubmit = async (data: AddSessionRequest) => {
    try {
      await mutateAsync(data);
      addToast({
        title: "Başarılı!",
        description: "Oturum başarıyla eklendi.",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Bir hata oluştu.",
        description:
          error instanceof Error
            ? error.message
            : "Beklenmedik bir hata ile karşılaştık.",
        color: "danger",
      });
    } finally {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-2"
            >
              <ModalHeader className="flex flex-col gap-1">
                Yeni Oturum Ekle
                <span className="text-xs text-default-500">
                  {format(date, "d MMMM EEEE", { locale: tr })} günü için plan
                  yap.
                </span>
              </ModalHeader>
              <ModalBody>
                <Select
                  variant="bordered"
                  label="Sınav"
                  labelPlacement="outside"
                  isVirtualized
                  selectionMode="single"
                  disallowEmptySelection
                  maxListboxHeight={80}
                  isDisabled={isPending}
                  placeholder="Lütfen çalışacağınız sınavı seçiniz."
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    form.setValue("exam", e.target.value);

                    switch (e.target.value) {
                      case "TYT":
                        setLessonNames([...TytLessonNames]);
                        break;
                      case "AYT":
                        setLessonNames(
                          Array.from(
                            new Set([...AytEaLessonNames, ...AytMfLessonNames]),
                          ),
                        );
                        break;
                      default:
                        setLessonNames([]);
                        break;
                    }
                    form.trigger("exam");
                  }}
                  errorMessage={form.formState.errors.exam?.message}
                  isInvalid={!!form.formState.errors.exam}
                >
                  {EXAM_TYPES.map((exam) => (
                    <SelectItem key={exam}>{exam}</SelectItem>
                  ))}
                </Select>
                <Select
                  variant="bordered"
                  label="Ders"
                  labelPlacement="outside"
                  isVirtualized
                  selectionMode="single"
                  isDisabled={isPending}
                  disallowEmptySelection
                  placeholder="Lütfen çalışma yapacağınız dersi seçiniz."
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    form.setValue("lesson", e.target.value);
                    form.trigger("lesson");
                  }}
                  errorMessage={form.formState.errors.lesson?.message}
                  isInvalid={!!form.formState.errors.lesson}
                >
                  {lessonNames.map((lesson) => (
                    <SelectItem key={lesson}>{lesson}</SelectItem>
                  ))}
                </Select>
                <Select
                  variant="bordered"
                  label="Çalışma Türü"
                  labelPlacement="outside"
                  isVirtualized
                  selectionMode="single"
                  disallowEmptySelection
                  isDisabled={isPending}
                  maxListboxHeight={192}
                  placeholder="Lütfen hangi tür çalışma yapacağınızı seçiniz."
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    form.setValue("type", e.target.value);
                    form.trigger("type");
                  }}
                  errorMessage={form.formState.errors.type?.message}
                  isInvalid={!!form.formState.errors.type}
                >
                  {STUDY_TYPES.map((type) => (
                    <SelectItem key={type}>{type}</SelectItem>
                  ))}
                </Select>

                <Autocomplete
                  variant="bordered"
                  label="Konu"
                  labelPlacement="outside"
                  isVirtualized
                  isDisabled={isPending}
                  placeholder="Lütfen çalışma yapacağınız konuyu seçiniz."
                  onSelectionChange={(value: Key | null) => {
                    form.setValue("topic", value as string);
                    form.trigger("topic");
                  }}
                  errorMessage={form.formState.errors.topic?.message}
                  isInvalid={!!form.formState.errors.topic}
                >
                  {getTopics(
                    form.watch("exam") as Exam | "AYT",
                    form.watch("lesson") as LessonName,
                  ).map((topic) => (
                    <AutocompleteItem key={topic}>{topic}</AutocompleteItem>
                  ))}
                </Autocomplete>

                <Textarea
                  variant="bordered"
                  className="col-span-2"
                  label="Hedef & Amaç"
                  labelPlacement="outside"
                  isDisabled={isPending}
                  placeholder="Her çalışmanın spesifik bir amacı ve hedefi olmalıdır. Örneğin, trigonometride toplam-fark formüllerinde takıldığım soru tiplerinin çözümünü izleyip, her soruyu hoca çözmeden önce kendim deneyerek 1 saatte bu eksiği kapatacağım."
                  {...form.register("goal")}
                ></Textarea>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose} isDisabled={isPending}>
                  İptal
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isDisabled={isPending}
                  isLoading={isPending}
                >
                  {isPending ? "Oturum ekleniyor ..." : "Oturum Ekle"}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

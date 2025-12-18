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
import { NumberInput, Switch } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key } from "@react-types/shared";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, Moon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AytEaLessonNames,
  AytMfLessonNames,
  Exam,
  LessonName,
  TytLessonNames,
} from "../../analiz/types";
import { fetcher } from "../../analiz/utils";
import {
  UpdateSessionRequest,
  updateSessionSchema,
} from "../schemas/update_session.schema";
import { Session } from "../types";
import { getTopics } from "../utils";

interface SessionDetailsModalProps {
  session: Session;
  date: Date;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const EXAM_TYPES = ["TYT", "AYT"];
const STUDY_TYPES = [
  "Konu Çalışması",
  "Soru Çözümü",
  "Deneme Sınavı",
  "Video İzleme",
  "Özet Çıkarma",
];

export default function SessionDetailsModal({
  session,
  date,
  isOpen,
  onOpenChange,
}: SessionDetailsModalProps) {
  const [lessonNames, setLessonNames] = useState<LessonName[]>([]);

  const queryClient = useQueryClient();
  const form = useForm<UpdateSessionRequest>({
    resolver: zodResolver(updateSessionSchema),
    defaultValues: {
      id: session.id,
      exam: session.exam,
      lesson: session.lesson,
      type: session.type,
      topic: session.topic,
      duration: session.duration,
      notes: session.notes,
      date: date,
      goal: session.goal,
      questionCount: session.questionCount,
      isCompleted: session.isCompleted,
    },
  });

  const handleSubmit = async (data: UpdateSessionRequest) => {
    try {
      const response = await fetcher("sessions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response?.success) {
        addToast({
          title: "Başarılı!",
          description: "Oturum başarıyla güncellendi.",
          color: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["sessions", date.toISOString()],
          exact: false,
        });
      } else {
        throw new Error(response?.message || "Bilinmeyen bir hata oluştu.");
      }
    } catch (error: any) {
      addToast({
        title: "Hata!",
        description: error.message || "Bir hata oluştu, lütfen tekrar deneyin.",
        color: "danger",
      });
    } finally {
      form.reset();
      onOpenChange(false);
    }
  };

  useEffect(() => {
    const exam = form.getValues("exam");
    switch (exam) {
      case "TYT":
        setLessonNames([...TytLessonNames]);
        break;
      case "AYT":
        setLessonNames(
          Array.from(new Set([...AytEaLessonNames, ...AytMfLessonNames])),
        );
        break;
      default:
        setLessonNames([]);
        break;
    }
  }, [form, isOpen, session.exam]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      onClose={() => {
        form.reset({
          id: session.id,
          date: date,
          exam: session.exam,
          lesson: session.lesson,
          questionCount: session.questionCount,
          type: session.type,
          topic: session.topic,
          isCompleted: session.isCompleted,
          duration: session.duration,
          notes: session.notes,
          goal: session.goal,
        });
        onOpenChange(false);
      }}
      isKeyboardDismissDisabled
    >
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
                  value={form.watch(`exam`)}
                  placeholder="Lütfen çalışacağınız sınavı seçiniz."
                  {...form.register("exam")}
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
                  disallowEmptySelection
                  placeholder="Lütfen çalışma yapacağınız dersi seçiniz."
                  {...form.register("lesson")}
                  value={form.watch(`lesson`)}
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
                  maxListboxHeight={160}
                  {...form.register("type")}
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
                  {...form.register("topic")}
                  placeholder="Lütfen çalışma yapacağınız konuyu seçiniz."
                  onSelectionChange={(value: Key | null) => {
                    form.setValue("topic", value?.toString() ?? "");
                    form.trigger("topic");
                  }}
                  errorMessage={form.formState.errors.topic?.message}
                  isInvalid={!!form.formState.errors.topic}
                >
                  {getTopics(
                    form.watch("exam", undefined) as Exam,
                    form.watch("lesson", undefined) as LessonName,
                  ).map((topic) => (
                    <AutocompleteItem key={topic}>{topic}</AutocompleteItem>
                  ))}
                </Autocomplete>
                <div className="flex items-end justify-between">
                  <Controller
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <NumberInput
                        endContent={<span>dakika</span>}
                        labelPlacement="outside"
                        value={form.watch("duration")}
                        onValueChange={(val) => field.onChange(val ?? 0)}
                        min={0}
                        variant="flat"
                        hideStepper
                        label="Süre"
                        className="w-1/2"
                        placeholder="Lütfen kaç dakika çalıştığınızı giriniz."
                      />
                    )}
                  />
                  <Switch
                    color="success"
                    size="sm"
                    endContent={<Moon></Moon>}
                    {...form.register("isCompleted")}
                    startContent={<Check />}
                  >
                    Tamamlandi
                  </Switch>
                </div>

                <Textarea
                  variant="bordered"
                  className="col-span-2"
                  label="Hedef & Amaç"
                  labelPlacement="outside"
                  placeholder="Her çalışmanın spesifik bir amacı ve hedefi olmalıdır. Örneğin, trigonometride toplam-fark formüllerinde takıldığım soru tiplerinin çözümünü izleyip, her soruyu hoca çözmeden önce kendim deneyerek 1 saatte bu eksiği kapatacağım."
                  {...form.register("goal")}
                ></Textarea>
                <Textarea
                  label="Notlar"
                  labelPlacement="outside-top"
                  variant="bordered"
                  classNames={{
                    input: "pt-1",
                  }}
                  {...form.register("notes")}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                  }}
                >
                  İptal
                </Button>
                <Button color="primary" type="submit">
                  Kaydet
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

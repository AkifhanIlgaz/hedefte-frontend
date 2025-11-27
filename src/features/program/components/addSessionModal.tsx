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
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ChangeEvent, Key } from "react";
import { useForm } from "react-hook-form";
import { tytLessons } from "../../analiz/data";
import { TytLessonNames } from "../../analiz/types";
import { fetcher } from "../../analiz/utils";
import {
  AddSessionRequest,
  addSessionSchema,
} from "../schemas/add_session.schema";

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
  const queryClient = useQueryClient();
  const form = useForm<AddSessionRequest>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: {
      date: date,
      isCompleted: false,
    },
  });

  const handleSubmit = async (data: AddSessionRequest) => {
    try {
      const response = await fetcher("sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response?.success) {
        addToast({
          title: "Başarılı!",
          description: "Oturum başarıyla eklendi.",
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
      onOpenChange(false);
    }
  };

  console.log(form.formState.errors);

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
                  label="Sinav"
                  labelPlacement="outside"
                  isVirtualized
                  selectionMode="single"
                  disallowEmptySelection
                  maxListboxHeight={80}
                  placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    form.setValue("exam", e.target.value);
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
                  placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    form.setValue("lesson", e.target.value);
                    form.trigger("lesson");
                  }}
                  errorMessage={form.formState.errors.lesson?.message}
                  isInvalid={!!form.formState.errors.lesson}
                >
                  {TytLessonNames.map((lesson) => (
                    <SelectItem key={lesson}>{lesson}</SelectItem>
                  ))}
                </Select>
                <Select
                  variant="bordered"
                  label="Tur"
                  labelPlacement="outside"
                  isVirtualized
                  selectionMode="single"
                  disallowEmptySelection
                  maxListboxHeight={160}
                  placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
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
                  placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                  onSelectionChange={(value: Key | null) => {
                    form.setValue("topic", value as string);
                    form.trigger("topic");
                  }}
                  errorMessage={form.formState.errors.topic?.message}
                  isInvalid={!!form.formState.errors.topic}
                >
                  {tytLessons.Türkçe.topics.map((topic) => (
                    <AutocompleteItem key={topic}>{topic}</AutocompleteItem>
                  ))}
                </Autocomplete>

                <Textarea
                  variant="bordered"
                  className="col-span-2"
                  label="Hedef & Amac"
                  labelPlacement="outside"
                  placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                  {...form.register("goal")}
                ></Textarea>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Action
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

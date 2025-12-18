import { useCompleteSession } from "@/src/lib/queries/useSessions";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { NumberInput } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { BookOpen, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  CompleteSessionRequest,
  completeSesssionSchema,
} from "../schemas/complete_session.schema";
import { Session } from "../types";
import { getBadgeColor, getLessonStyles } from "../utils";

interface CompleteModalProps {
  session: Session;
  date: Date;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function CompleteSessionModal({
  session,
  date,
  isOpen,
  onOpenChange,
}: CompleteModalProps) {
  const form = useForm<CompleteSessionRequest>({
    resolver: zodResolver(completeSesssionSchema),
    defaultValues: {
      id: session.id,
    },
  });
  const { mutateAsync: completeSession, isPending } = useCompleteSession(date);

  const handleSubmit = async (data: CompleteSessionRequest) => {
    try {
      await completeSession(data);
      addToast({
        title: "Başarılı!",
        description: "Oturum başarıyla tamamlandı.",
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
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Oturum Tamamla
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-center gap-4">
                  <div className="flex flex-col items-center gap-1 ">
                    <span className="text-xs text-default-500 text-center">
                      Sınav
                    </span>
                    <Chip
                      size="lg"
                      className={clsx(getBadgeColor(session.exam))}
                    >
                      {session.exam}
                    </Chip>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-default-500">Ders</span>
                    <Chip
                      size="lg"
                      className={clsx(
                        getLessonStyles(session.exam, session.lesson),
                      )}
                    >
                      {session.lesson}
                    </Chip>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs text-default-500">Tür</span>
                    <Chip size="lg">{session.type}</Chip>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center  gap-2">
                    <BookOpen className="size-4" />
                    <span>{session.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <NumberInput
                  endContent={<span>dakika</span>}
                  labelPlacement="outside"
                  variant="flat"
                  hideStepper
                  label="Süre"
                  isDisabled={isPending}
                  value={form.watch(`duration`)}
                  errorMessage={
                    form.formState.errors[`duration`]?.message as string
                  }
                  isInvalid={!!form.formState.errors[`duration`]}
                  onInput={(e) => {
                    form.setValue(
                      `duration`,
                      parseInt(e.currentTarget.value) || 0,
                    );
                    form.trigger(`duration`);
                  }}
                  placeholder="Lütfen kaç dakika çalıştığınızı giriniz."
                />
                <Textarea
                  label="Hedef & Amaç"
                  isDisabled={isPending}
                  labelPlacement="outside-top"
                  isReadOnly
                  variant="bordered"
                  classNames={{
                    input: "pt-1",
                  }}
                  value={session.goal}
                />
                <Textarea
                  label="Notlar"
                  labelPlacement="outside-top"
                  variant="bordered"
                  isDisabled={isPending}
                  {...form.register("notes")}
                  classNames={{
                    input: "pt-1",
                  }}
                />
                {session.type === "Soru Çözümü" && (
                  <NumberInput
                    label="Çözülen Soru Sayısı"
                    labelPlacement="outside"
                    placeholder="Lütfen çözülen soru adedini giriniz."
                    variant="bordered"
                    isDisabled={isPending}
                    value={form.watch(`questionCount`)}
                    errorMessage={
                      form.formState.errors[`questionCount`]?.message as string
                    }
                    isInvalid={!!form.formState.errors[`questionCount`]}
                    onInput={(e) => {
                      form.setValue(
                        `questionCount`,
                        parseInt(e.currentTarget.value) || 0,
                      );
                      form.trigger(`questionCount`);
                    }}
                    classNames={{
                      input: "pt-1",
                    }}
                  />
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Kapat
              </Button>
              <Button color="primary" type="submit" isLoading={isPending}>
                {isPending ? "Oturum tamamlanıyor ..." : "Oturumu Tamamla"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

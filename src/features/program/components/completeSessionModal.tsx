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
import { addToast, NumberInput } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { BookOpen, Clock } from "lucide-react";
import { GeneralResponse } from "../../analiz/types";
import { fetcher } from "../../analiz/utils";
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
  const queryClient = useQueryClient();
  const toggleCompletion = async () => {
    try {
      const response: GeneralResponse<any> = await fetcher(
        `sessions/complete/${session.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...session,
            isCompleted: !session.isCompleted,
          }),
        },
      );
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["sessions", date.toISOString()],
          exact: false,
        });
      } else {
        throw new Error(response.message || "Oturum silinemedi.");
      }
    } catch (error: any) {
      addToast({
        title: "Hata",
        description: error.message || "Bir hata oluştu.",
        color: "danger",
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
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
                  endContent={<span className="">dakika</span>}
                  labelPlacement="outside"
                  variant="flat"
                  hideStepper
                  label="Süre"
                  placeholder="Lütfen kaç dakika çalıştığınızı giriniz."
                />
                <Textarea
                  label="Hedef & Amaç"
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
              <Button
                color="primary"
                onPress={() => {
                  toggleCompletion().then(() => onClose());
                }}
              >
                Tamamla
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

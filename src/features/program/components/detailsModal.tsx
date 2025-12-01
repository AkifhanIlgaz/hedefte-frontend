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
import clsx from "clsx";
import { BookOpen, Clock } from "lucide-react";
import { Session } from "../types";
import { getBadgeColor, getLessonStyles } from "../utils";

interface DetailsModalProps {
  session: Session;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function DetailsModal({
  session,
  isOpen,
  onOpenChange,
}: DetailsModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Oturum Detayları
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
                      className={clsx(getLessonStyles(session.lesson))}
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
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Kapat
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

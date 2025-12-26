"use client";

import useDeleteTopicMistake from "@/src/lib/queries/topicMistakes/useDeleteTopicMistake";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

interface DeleteModalProps {
  id: string;
}

export default function DeleteModal({ id }: DeleteModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { mutateAsync: deleteTopicMistake, isPending } =
    useDeleteTopicMistake();

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async () => {
    try {
      await deleteTopicMistake(id);
      addToast({
        title: "Soru silindi",
        description: "Seçilen soru başarıyla silindi.",
        color: "success",
      });
      onClose();
    } catch (error) {
      addToast({
        title: "Silme başarısız",
        description: "Soru silinirken bir hata oluştu. Lütfen tekrar deneyin.",
        color: "danger",
      });
    }
  };

  const isSubmitDisabled = !isConfirmed || isPending;

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        color="danger"
        startContent={<TrashIcon className="size-4" />}
        onPress={onOpen}
      >
        Sil
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(closeHandler) => (
            <>
              <ModalHeader className="flex items-center gap-3 text-xl font-semibold">
                Soruyu silmek istediğine emin misin?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-500">
                  Bu işlem geri alınamaz. Soru ve ilişkili veriler kalıcı olarak
                  silinir.
                </p>
                <Checkbox
                  isSelected={isConfirmed}
                  onValueChange={setIsConfirmed}
                >
                  Silme işlemini onaylıyorum
                </Checkbox>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={closeHandler}>
                  İptal
                </Button>
                <Button
                  color="danger"
                  onPress={handleSubmit}
                  isDisabled={isSubmitDisabled}
                  isLoading={isPending}
                >
                  Sil
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

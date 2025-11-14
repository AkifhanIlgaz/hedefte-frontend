import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { CircleAlert } from "lucide-react";

interface MissingProfileInfoModalProps {
  isOpen: boolean;
  onOpenChange: ((isOpen: boolean) => void) | undefined;
}

export default function MissingProfileInfoModal({
  isOpen,
  onOpenChange,
}: MissingProfileInfoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-center gap-2 pb-0">
              <span className=" text-xl font-bold text-danger">
                Profil Bilgilerin Eksik
              </span>
              <CircleAlert className="size-6 text-danger " />
            </ModalHeader>
            <ModalBody className="text-center">
              <p>
                Profil, hedef ve sınav bilgilerin tam değil. Uygulamayı
                kullanmaya devam edebilmek için lütfen eksik alanları doldur.
              </p>
            </ModalBody>
            <ModalFooter className="flex items-center justify-center">
              <Button
                as={Link}
                color="primary"
                onPress={onClose}
                href="/dashboard/profil"
              >
                Bilgileri Tamamla
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

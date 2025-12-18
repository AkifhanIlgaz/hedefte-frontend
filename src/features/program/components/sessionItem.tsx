import { useDeleteSession } from "@/src/lib/queries/sessions/useDeleteSession";
import { Card, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, EllipsisVertical, Info, Trash } from "lucide-react";
import { Session } from "../types";
import { getBadgeColor, getLessonStyles } from "../utils";
import CompleteSessionModal from "./completeSessionModal";
import SessionDetailsModal from "./detailsModal";

export default function SessionItem({
  session,
  date,
}: {
  session: Session;
  date: Date;
}) {
  const detailsModal = useDisclosure();
  const completeModal = useDisclosure();

  const { mutateAsync: deleteSession, isPending } = useDeleteSession(date);

  const handleDeleteSession = async () => {
    try {
      await deleteSession(session.id);
      addToast({
        title: "Başarılı",
        description: "Oturum başarıyla silindi.",
        color: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        addToast({
          title: "Hata",
          description: error.message || "Bir hata oluştu.",
          color: "danger",
        });
      }
    }
  };

  return (
    <>
      <SessionDetailsModal
        {...detailsModal}
        date={date}
        session={session}
      ></SessionDetailsModal>
      <CompleteSessionModal
        {...completeModal}
        session={session}
        date={date}
      ></CompleteSessionModal>
      <AnimatePresence initial={true}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <Card
            className={clsx(
              "flex-1 w-full shadow border border-default",
              session.isCompleted && "bg-success-50 border-success-500 ",
            )}
            isPressable={!isPending}
            onPress={() => {
              if (session.isCompleted) {
                return;
              }
              completeModal.onOpen();
            }}
          >
            <CardHeader className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-start gap-2">
                  <Chip size="sm" className={clsx(getBadgeColor(session.exam))}>
                    {session.exam}
                  </Chip>
                  <Chip
                    size="sm"
                    className={clsx(
                      getLessonStyles(session.exam, session.lesson),
                    )}
                  >
                    {session.lesson}
                  </Chip>
                </div>
                <div className="flex items-center gap-2 text-xs text-default-500">
                  <span className="flex items-center gap-1 text-ellipsis">
                    <BookOpen className="h-3 w-3" />
                    {session.type}
                  </span>
                </div>
              </div>

              <Dropdown className=" border-default-200">
                <DropdownTrigger>
                  <EllipsisVertical className="text-default-400 size-5" />
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key) => {
                    if (key === "delete") handleDeleteSession();
                    if (key === "details") detailsModal.onOpen();
                  }}
                >
                  <DropdownItem
                    key="details"
                    variant="solid"
                    color="default"
                    startContent={<Info className="size-4" />}
                  >
                    Ayrıntılar
                  </DropdownItem>

                  <DropdownItem
                    key="delete"
                    variant="solid"
                    color="danger"
                    className="text-danger"
                    startContent={<Trash className="size-4" />}
                  >
                    Sil
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardHeader>
          </Card>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

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
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, EllipsisVertical, Info, Trash } from "lucide-react";
import { GeneralResponse } from "../../analiz/types";
import { fetcher } from "../../analiz/utils";
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
  const queryClient = useQueryClient();
  const detailsModal = useDisclosure();
  const completeModal = useDisclosure();
  const deleteSession = async () => {
    try {
      const response: GeneralResponse<any> = await fetcher(
        `sessions/${session.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.success) {
        addToast({
          title: "Başarılı",
          description: "Oturum başarıyla silindi.",
          color: "success",
        });
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

  // const toggleCompletion = async () => {
  //   try {
  //     const response: GeneralResponse<any> = await fetcher(
  //       `sessions/complete/${session.id}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           ...session,
  //           isCompleted: !session.isCompleted,
  //         }),
  //       },
  //     );
  //     console.log(response);
  //     if (response.success) {
  //       queryClient.invalidateQueries({
  //         queryKey: ["sessions", date.toISOString()],
  //         exact: false,
  //       });
  //     } else {
  //       throw new Error(response.message || "Oturum silinemedi.");
  //     }
  //   } catch (error: any) {
  //     addToast({
  //       title: "Hata",
  //       description: error.message || "Bir hata oluştu.",
  //       color: "danger",
  //     });
  //   }
  // };
  return (
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
          isPressable
          onPress={() => {
            if (session.isCompleted) {
              return;
            }
            completeModal.onOpen();
          }}
        >
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
          <CardHeader className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-start gap-2">
                <Chip size="sm" className={clsx(getBadgeColor(session.exam))}>
                  {session.exam}
                </Chip>
                <Chip
                  size="sm"
                  className={clsx(getLessonStyles(session.lesson))}
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
                  if (key === "delete") deleteSession();
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
  );
}

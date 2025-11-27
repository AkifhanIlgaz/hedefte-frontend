import { Card, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, EllipsisVertical, Info, Trash } from "lucide-react";
import { tytLessons } from "../../analiz/data";
import { TytLessonName } from "../../analiz/types";

type StudySession = {
  id: string;
  date: Date;
  exam: string; // Örn: TYT, AYT, Yazılı
  lesson: string; // Örn: Matematik
  type: string; // Örn: Konu, Soru, Deneme
  goal: string; // Örn: 50 soru çözülecek
  isCompleted: boolean;
};

export default function SessionItem({ session }: { session: StudySession }) {
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 }, // Initial state (hidden)
    visible: { opacity: 1, y: 0 }, // Visible state (enter)
    exit: { opacity: 0, y: -20 }, // Exit state (leave)
  };

  // Renk kodları - Sınav tipine göre
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "TYT":
        return "bg-primary-100 text-primary-700 hover:bg-primary-200 border-primary-200";
      case "AYT":
        return "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 border-secondary-200";
      case "YDT":
        return "bg-accent-100 text-accent-700 hover:bg-accent-200 border-accent-200";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
    }
  };

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
                    tytLessons[session.lesson as TytLessonName].iconColor,
                    tytLessons[session.lesson as TytLessonName].bgClass,
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

            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="border border-default-200">
                <DropdownTrigger>
                  <EllipsisVertical className="text-default-400 size-5" />
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="view"
                    variant="solid"
                    color="default"
                    startContent={<Info className="size-4" />}
                  >
                    Ayrintilar
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
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

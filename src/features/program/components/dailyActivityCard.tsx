import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Plus } from "lucide-react";
import { Session } from "../types";
import AddSessionModal from "./addSessionModal";
import SessionItem from "./sessionItem";

export default function DailyActivityCard({
  date,
  title,
  sessions,
  isPending,
  emptyContent,
}: {
  date: Date;
  title: string;
  isPending: boolean;
  sessions: Session[];
  emptyContent?: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between  border-b-2 ">
        <span className="text-lg font-bold text-secondary">{title}</span>

        <Button
          isIconOnly
          color="default"
          onPress={onOpen}
          className="size-4 bg-transparent rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <AddSessionModal
          date={date}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      </CardHeader>

      <CardBody className="pt-4 ">
        {isPending ? (
          <div className="flex flex-col items-center justify-center text-slate-400 text-sm">
            <Spinner className="h-8 w-8 mb-2" /> Oturumlar yükleniyor...
          </div>
        ) : emptyContent ? (
          <div className="flex flex-col h-full items-center justify-center text-slate-400 text-sm ">
            {emptyContent}
          </div>
        ) : (
          <div className="space-y-3">
            {sessions
              .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted)) // Tamamlanmamışlar üstte, tamamlanmışlar altta
              .map((session) => (
                <SessionItem key={session.id} session={session} date={date!} />
              ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

import { useSessions } from "@/src/queries/useSessions";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import clsx from "clsx";
import { format, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Plus } from "lucide-react";
import AddSessionModal from "./addSessionModal";
import SessionItem from "./sessionItem";

export default function DayCard({ date }: { date: Date }) {
  const isToday = isSameDay(date, new Date());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { sessions, isLoading } = useSessions({
    date,
  });

  return (
    <Card
      className={clsx("max-h-fit ", {
        "shadow-lg shadow-success-500": isToday,
      })}
    >
      <CardHeader className="flex flex-row items-center justify-between  border-b-2 ">
        <div>
          <span className="text-lg font-bold text-secondary">
            {format(date, "EEEE", { locale: tr })}
          </span>
          <div className="text-xs text-default-500 font-medium">
            {format(date, "d MMMM", { locale: tr })}
          </div>
        </div>

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

      <CardBody className="pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 text-sm">
            <Spinner className="h-8 w-8 mb-2" />{" "}
            {/* Replace Loader with Spinner */}
            Oturumlar yükleniyor...
          </div>
        ) : (
          <div className="space-y-3">
            {sessions
              ?.slice() // Orijinal diziyi değiştirmemek için bir kopya oluştur
              .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted)) // Tamamlanmamışlar üstte, tamamlanmışlar altta
              .map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
          </div>
        )}
        {!isLoading && sessions.length === 0 && (
          <div className="flex flex-col h-fit items-center justify-center text-slate-400 text-sm">
            <Calendar className="h-8 w-8 mb-2 opacity-20" />
            Henüz oturum eklenmedi.
          </div>
        )}
      </CardBody>
    </Card>
  );
}

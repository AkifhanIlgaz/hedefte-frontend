import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { format, isSameDay } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AddSessionRequest,
  addSessionSchema,
} from "../schemas/add_session.schema";
import AddSessionModal from "./addSessionModal";
import SessionItem from "./sessionItem";

type StudySession = {
  id: string;
  date: Date;
  exam: string; // Örn: TYT, AYT, Yazılı
  lesson: string; // Örn: Matematik
  type: string; // Örn: Konu, Soru, Deneme
  goal: string; // Örn: 50 soru çözülecek
  isCompleted: boolean;
};

const exampleSessions: StudySession[] = [
  {
    id: "1",
    date: new Date(),
    exam: "TYT",
    lesson: "Matematik",
    type: "Soru Çözümü",
    goal: "50 soru çözülecek",
    isCompleted: false,
  },
  {
    id: "2",
    date: new Date(),
    exam: "AYT",
    lesson: "Fizik",
    type: "Konu Çalışması",
    goal: "2 saatlik konu çalışması",
    isCompleted: false,
  },
  {
    id: "3",
    date: new Date(),
    exam: "TYT",
    lesson: "Türkçe",
    type: "Deneme Sınavı",
    goal: "1 deneme sınavı",
    isCompleted: false,
  },
  {
    id: "4",
    date: new Date(),
    exam: "AYT",
    lesson: "Kimya",
    type: "Video İzleme",
    goal: "1 saatlik video",
    isCompleted: true,
  },
  {
    id: "5",
    date: new Date(),
    exam: "TYT",
    lesson: "Biyoloji",
    type: "Özet Çıkarma",
    goal: "1 ünite özeti",
    isCompleted: false,
  },
];

export default function DayCard({ date }: { date: Date }) {
  const [sessions, setSessions] = useState(exampleSessions);
  const isToday = isSameDay(date, new Date());

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm<AddSessionRequest>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: {
      date: date,
      isCompleted: false,
    },
  });

  // Progress calculation
  const completedCount = exampleSessions.filter((s) => s.isCompleted).length;
  const totalCount = exampleSessions.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleSession = (id: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === id ? { ...s, isCompleted: !s.isCompleted } : s,
      ),
    );
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  return (
    <Card
      className={clsx("flex flex-col h-full ", {
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

      <CardBody className="flex-1 pt-4">
        {/* Progress bar line */}
        {totalCount > 0 && (
          <div className="mb-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={clsx(
                "h-full transition-all duration-500 rounded-full",
                progress === 100 ? "bg-green-500" : "bg-blue-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {sessions.length === 0 ? (
          <div className=" flex flex-col items-center justify-center text-slate-400 text-sm ">
            <Calendar className="h-8 w-8 mb-2 opacity-20" />
            Henüz oturum eklenmedi.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions
              .slice() // Orijinal diziyi değiştirmemek için bir kopya oluştur
              .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted)) // Tamamlanmamışlar üstte, tamamlanmışlar altta
              .map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  onToggle={() => toggleSession(session.id)}
                  onDelete={() => deleteSession(session.id)}
                />
              ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

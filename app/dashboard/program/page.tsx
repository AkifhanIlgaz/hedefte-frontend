"use client";

import { tytLessons } from "@/src/features/analiz/data";
import { TytLessonNames } from "@/src/features/analiz/types";
import {
  AddSessionRequest,
  addSessionSchema,
} from "@/src/features/program/schemas/add_session.schema";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import { tr } from "date-fns/locale";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type StudySession = {
  id: string;
  date: Date;
  exam: string; // Örn: TYT, AYT, Yazılı
  lesson: string; // Örn: Matematik
  type: string; // Örn: Konu, Soru, Deneme
  goal: string; // Örn: 50 soru çözülecek
  isCompleted: boolean;
};

const EXAM_TYPES = ["TYT", "AYT"];
const STUDY_TYPES = [
  "Konu Çalışması",
  "Soru Çözümü",
  "Deneme Sınavı",
  "Video İzleme",
  "Özet Çıkarma",
];

export default function Page() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));

  // Haftalık günleri oluştur
  useEffect(() => {
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    const end = endOfWeek(startDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    setWeekDays(days);
  }, [startDate]);

  const handlePrevWeek = () =>
    setStartDate((date) => subDays(startOfWeek(date, { weekStartsOn: 1 }), 7));
  const handleNextWeek = () =>
    setStartDate((date) => addDays(startOfWeek(date, { weekStartsOn: 1 }), 7));
  const handleToday = () => setStartDate(startOfDay(new Date()));

  const addSession = (session: Omit<StudySession, "id" | "isCompleted">) => {
    const newSession: StudySession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      isCompleted: false,
    };
    setSessions([...sessions, newSession]);
  };

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
    <div className="flex flex-col gap-6 min-h-screen">
      <DashboardHeader
        title="Haftalık Çalışma Programım"
        description={
          "Hedeflerini belirle, ilerlemeni takip et ve başarıya ulaş."
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 shadow-sm dark:border-slate-700 bg-neutral">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            onPress={handlePrevWeek}
            className="h-9 w-9 bg-transparent dark:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 text-secondary" />
          </Button>
          <div className="flex flex-col mx-2">
            <span className="text-sm font-medium text-secondary">
              Çalışma Aralığı
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-secondary">
                {weekDays.length > 0 &&
                  format(weekDays[0], "d MMM", { locale: tr })}
              </span>
              <span className="text-secondary">-</span>
              <span className="text-lg font-bold text-secondary">
                {weekDays.length > 0 &&
                  format(weekDays[6], "d MMM yyyy", { locale: tr })}
              </span>
            </div>
          </div>
          <Button
            onPress={handleNextWeek}
            className="h-9 w-9 bg-transparent dark:bg-transparent"
          >
            <ChevronRight className="h-4 w-4 text-secondary" />
          </Button>
        </div>
        <Button color="primary" onPress={handleToday} variant="ghost">
          Bugüne Dön
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {weekDays.map((day) => (
          <DayCard
            key={day.toString()}
            date={day}
            sessions={sessions.filter((s) => isSameDay(s.date, day))}
            onAddSession={addSession}
            onToggleSession={toggleSession}
            onDeleteSession={deleteSession}
          />
        ))}
      </div>
    </div>
  );
}

function DayCard({
  date,
  sessions,
  onAddSession,
  onToggleSession,
  onDeleteSession,
}: {
  date: Date;
  sessions: StudySession[];
  onAddSession: (s: any) => void;
  onToggleSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}) {
  const isToday = isSameDay(date, new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm<AddSessionRequest>({
    resolver: zodResolver(addSessionSchema),
    defaultValues: {
      date: date,
    },
  });

  const handleSubmit = (data: AddSessionRequest) => {
    console.log(data);
    setIsAddOpen(false);
    onAddSession(data);
  };

  console.log(form.formState.errors);

  // Progress calculation
  const completedCount = sessions.filter((s) => s.isCompleted).length;
  const totalCount = sessions.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <Card
      className={clsx("flex flex-col h-full border-t-2 border-t-slate-400", {
        "shadow-[0_4px_15px_rgba(255,193,7,0.4)]": isToday,
      })}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <span className="text-lg font-bold text-secondary">
            {format(date, "EEEE", { locale: tr })}
          </span>
          <div className="text-sm text-secondary font-medium">
            {format(date, "d MMMM", { locale: tr })}
          </div>
        </div>

        <Button
          variant="bordered"
          color="primary"
          onPress={onOpen}
          className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-600 border-dashed border-slate-300 bg-transparent"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Oturum Ekle</span>
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-2"
                >
                  <ModalHeader className="flex flex-col gap-1">
                    Yeni Oturum Ekle
                    <span className="text-xs text-default-500">
                      {format(date, "d MMMM EEEE", { locale: tr })} günü için
                      plan yap.
                    </span>
                  </ModalHeader>
                  <ModalBody>
                    <Select
                      variant="bordered"
                      label="Sinav"
                      labelPlacement="outside"
                      isVirtualized
                      selectionMode="single"
                      disallowEmptySelection
                      maxListboxHeight={80}
                      placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        form.setValue("exam", e.target.value);
                        form.trigger("exam");
                      }}
                      errorMessage={form.formState.errors.exam?.message}
                      isInvalid={!!form.formState.errors.exam}
                    >
                      {EXAM_TYPES.map((exam) => (
                        <SelectItem key={exam}>{exam}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      variant="bordered"
                      label="Ders"
                      labelPlacement="outside"
                      isVirtualized
                      selectionMode="single"
                      disallowEmptySelection
                      placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        form.setValue("lesson", e.target.value);
                        form.trigger("lesson");
                      }}
                      errorMessage={form.formState.errors.lesson?.message}
                      isInvalid={!!form.formState.errors.lesson}
                    >
                      {TytLessonNames.map((lesson) => (
                        <SelectItem key={lesson}>{lesson}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      variant="bordered"
                      label="Tur"
                      labelPlacement="outside"
                      isVirtualized
                      selectionMode="single"
                      disallowEmptySelection
                      maxListboxHeight={160}
                      placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        form.setValue("type", e.target.value);
                        form.trigger("type");
                      }}
                      errorMessage={form.formState.errors.type?.message}
                      isInvalid={!!form.formState.errors.type}
                    >
                      {STUDY_TYPES.map((type) => (
                        <SelectItem key={type}>{type}</SelectItem>
                      ))}
                    </Select>

                    <Autocomplete
                      variant="bordered"
                      label="Konu"
                      labelPlacement="outside"
                      isVirtualized
                      placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                      onSelect={(e: ChangeEvent<HTMLInputElement>) => {
                        form.setValue("topic", e.target.value);
                        form.trigger("topic");
                      }}
                      errorMessage={form.formState.errors.topic?.message}
                      isInvalid={!!form.formState.errors.topic}
                    >
                      {tytLessons.Türkçe.topics.map((topic) => (
                        <AutocompleteItem key={topic}>{topic}</AutocompleteItem>
                      ))}
                    </Autocomplete>

                    <Textarea
                      variant="bordered"
                      className="col-span-2"
                      label="Hedef & Amac"
                      labelPlacement="outside"
                      placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                    ></Textarea>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit">
                      Action
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
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
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                onToggle={() => onToggleSession(session.id)}
                onDelete={() => onDeleteSession(session.id)}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function SessionItem({
  session,
  onToggle,
  onDelete,
}: {
  session: StudySession;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
    <div className="flex-1 grid gap-1">
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            "font-semibold text-sm",
            session.isCompleted && "line-through text-slate-500",
          )}
        >
          {session.lesson}
        </span>
        <Badge
          variant="shadow"
          className={clsx(
            "text-[10px] px-1.5 h-5 border",
            getBadgeColor(session.type),
          )}
        >
          {session.type}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          {session.type}
        </span>
      </div>
    </div>
  );
}

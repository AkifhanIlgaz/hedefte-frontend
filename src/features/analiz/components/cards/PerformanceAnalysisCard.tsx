import { Field } from "@/src/features/profil/types";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { ChevronsRight, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { getLessons } from "../../data";
import { Exam } from "../../types";
import LessonAccordion from "../LessonAccordion";

interface PerformanceAnalysisCardProps {
  exam: Exam;
  field: Field;
  isLoading: boolean;
}

export default function PerformanceAnalysisCard({
  exam,
  field,
  isLoading,
}: PerformanceAnalysisCardProps) {
  const form = useFormContext();
  const lessons = getLessons(exam, field);
  const examDetailsModal = useDisclosure();
  // Tekil Net Hesaplama Fonksiyonu
  const calculateNet = (correct, incorrect) => {
    return (correct - incorrect * 0.25).toFixed(2);
  };

  return (
    <>
      <Card className="p-3">
        <CardHeader className="flex  items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-md font-bold">Net ve Konu Analizi</span>
            <span className="text-xs text-default-500">
              Derslere ait doğru, yanlış ve boş sayılarını girebilir, her
              konudan kaç yanlış yaptığını ekleyebilirsin.
            </span>
          </div>
          <Modal
            isOpen={examDetailsModal.isOpen}
            onOpenChange={examDetailsModal.onOpenChange}
            scrollBehavior="inside"
            backdrop="blur"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col items-center ">
                    <p className="text-xl font-bold">
                      {form.getValues("name")}
                    </p>
                    <p>{form.getValues("date").toLocaleDateString()}</p>
                    <Chip
                      variant="shadow"
                      className="font-bold text-xl px-4 py-2"
                      startContent={
                        <span className="text-md bg-transparent font-light  ">
                          Toplam:
                        </span>
                      }
                    >
                      97,75
                    </Chip>
                  </ModalHeader>
                  <ModalBody>
                    {Object.values(lessons).map((lesson) => (
                      <div
                        key={lesson.name}
                        className={`
                                flex justify-between items-center p-3 rounded-xl border-1 border-default-200 shadow-sm
                                transition-transform hover:scale-[1.02] cursor-default bg-content1

                              `}
                      >
                        {/* Sol: Ders Adı */}
                        <span className="text-md font-bold text-default-700">
                          {lesson.name}
                        </span>
                        <div className="flex items-end justify-end gap-4">
                          <div className="flex gap-2 text-md font-semibold ">
                            <span className="text-success-600">
                              {form.watch(`${lesson.name}.correct`)} D
                            </span>
                            <span className="text-danger-500">
                              {form.watch(`${lesson.name}.wrong`)}Y
                            </span>
                          </div>
                          <ChevronsRight />
                          <span className="text-md bg-transparent font-bold  ">
                            {calculateNet(
                              form.watch(`${lesson.name}.correct`),
                              form.watch(`${lesson.name}.wrong`),
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </ModalBody>
                  <ModalFooter className="flex items-center justify-between">
                    <Button type="submit" color="primary">
                      <Save className="size-4" />
                      Denemeyi Kaydet
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Button color="primary" onPress={examDetailsModal.onOpen}>
            <Save className="size-4" />
            Denemeyi Kaydet
          </Button>
        </CardHeader>
        <CardBody className="gap-3">
          {Object.values(lessons).map((lesson) => (
            <LessonAccordion lesson={lesson} key={lesson.name} />
          ))}
        </CardBody>
      </Card>
    </>
  );
}

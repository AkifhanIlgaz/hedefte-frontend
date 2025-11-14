"use client";
import { tytLessons } from "@/src/features/analiz/data";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  DatePicker,
  Input,
  NumberInput,
  Snippet,
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [val, setVal] = useState<number>();

  const [arr, setArr] = useState<Array<number>>([]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-3">
        <CardHeader className="flex flex-col items-start">
          <span className="text-md font-bold">Sınav Bilgileri</span>
          <span className="text-xs text-default-500">
            Çözdüğün denemenin tarihini ve ismini buradan düzenleyebilirsin.
          </span>
        </CardHeader>
        <CardBody>
          <div className="flex gap-5 items-end justify-center">
            <Select
              label="Sınav"
              labelPlacement="outside"
              placeholder="Lütfen çözdüğünüz denemenin türünü giriniz."
              classNames={{
                label: "text-xs font-semibold",
              }}
            >
              <SelectItem key={"TYT"}>TYT</SelectItem>
              <SelectItem key={"AYT"}>AYT</SelectItem>
              <SelectItem key={"LGS"}>LGS</SelectItem>
            </Select>
            <DatePicker
              labelPlacement="outside"
              label="Deneme Tarihi"
              classNames={{
                label: "text-xs font-semibold",
              }}
            />
            <Input
              type="text"
              label="Deneme İsmi"
              placeholder="Lütfen çözdüğünüz denemenin ismini giriniz."
              labelPlacement="outside-top"
              classNames={{
                label: "text-xs font-semibold",
              }}
            />
          </div>
        </CardBody>
      </Card>

      <Card className="p-3">
        <CardHeader className="flex flex-col items-start">
          <span className="text-md font-bold">Net ve Konu Analizi</span>
          <span className="text-xs text-default-500">
            Derslere ait doğru, yanlış ve boş sayılarını girebilir, her konudan
            kaç yanlış yaptığını ekleyebilirsin.
          </span>
        </CardHeader>
        <CardBody>
          <Accordion variant="splitted">
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title={
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "p-2 rounded-full",
                      tytLessons.Türkçe.bgClass,
                    )}
                  >
                    <tytLessons.Türkçe.icon
                      className={clsx("size-4", tytLessons.Türkçe.iconColor)}
                    />
                  </div>
                  <span
                    className={clsx(`text-md`, tytLessons.Türkçe.iconColor)}
                  >
                    {tytLessons.Türkçe.name}
                  </span>
                </div>
              }
              className="data-[open=true]:pb-4 "
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <Card className="p-3 max-h-fit">
                  <CardHeader className="flex flex-col items-center justify-between">
                    <div className="flex flex-col items-center">
                      <h1 className="font-bold text-6xl">35.5 </h1>
                      <div className="flex gap-5">
                        <span className="text-success">36 D</span>
                        <span className="text-danger">4 Y</span>
                        <span className="text-default-600">0 B</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="flex gap-3">
                    <NumberInput
                      label="Doğru"
                      labelPlacement="outside"
                      placeholder="Lütfen kaç soruyu doğru yaptığınızı giriniz."
                      hideStepper
                      variant="bordered"
                      minValue={0}
                      size="sm"
                      value={val}
                      onValueChange={setVal}
                      classNames={{
                        label: "text-xs",
                        input: "text-center",
                      }}
                    />

                    <NumberInput
                      label="Yanlış"
                      labelPlacement="outside"
                      placeholder="Lütfen kaç soruyu yanlış yaptığınızı giriniz."
                      hideStepper
                      size="sm"
                      variant="bordered"
                      minValue={0}
                      classNames={{
                        label: "text-xs",
                        input: "text-center",
                      }}
                    />

                    <NumberInput
                      label="Boş"
                      labelPlacement="outside"
                      placeholder="Lütfen kaç soruyu boş bıraktığınızı giriniz"
                      hideStepper
                      variant="bordered"
                      size="sm"
                      minValue={0}
                      classNames={{
                        label: "text-xs",
                        input: "text-center",
                      }}
                    />

                    <NumberInput
                      label="Süre"
                      labelPlacement="outside"
                      placeholder="Lütfen testi kaç dakikada çözdüğünüzü giriniz."
                      hideStepper
                      variant="bordered"
                      size="sm"
                      minValue={0}
                      classNames={{
                        label: "text-xs",
                        input: "text-center",
                      }}
                    />
                  </CardBody>
                </Card>

                <Card className="p-3 max-h-fit">
                  <CardHeader className="flex items-center justify-center">
                    <CircularProgress
                      classNames={{
                        svg: "w-36 h-36 drop-shadow-md",

                        // Light mode stroke + Dark mode stroke
                        indicator: "stroke-black dark:stroke-white",

                        // Light mode track + Dark mode track
                        track: "stroke-black/10 dark:stroke-white/10",

                        // Value renkleri (Light: black, Dark: white)
                        value:
                          "text-3xl font-semibold text-black dark:text-white",
                      }}
                      showValueLabel={true}
                      strokeWidth={2}
                      value={60}
                    />
                  </CardHeader>
                  <CardBody className="flex items-center justify-end gap-4">
                    <Select
                      variant="bordered"
                      label="Konu"
                      labelPlacement="outside"
                      placeholder="Lütfen yanlış yaptığınız veya boş bıraktığınız konuyu seçiniz."
                    >
                      <SelectItem key={"PAragraf"}>Paragraf</SelectItem>
                    </Select>
                    <div className="flex items-center gap-4">
                      <Button isIconOnly>
                        <Minus />
                      </Button>
                      <NumberInput
                        hideStepper
                        size="sm"
                        radius="full"
                        variant="bordered"
                        minValue={0}
                        classNames={{
                          label: "text-xs",
                          input: "text-center",
                        }}
                      />
                      <Button isIconOnly>
                        <Plus />
                      </Button>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div className="flex flex-col gap-4 w-full">
                      <Button color="primary">Ekle</Button>
                    </div>
                  </CardFooter>
                </Card>
                <Card className="p-3 h-full ">
                  <CardHeader>
                    <Button
                      onPress={() => setArr((prev) => [...prev, Math.random()])}
                    >
                      Ekle
                    </Button>
                  </CardHeader>
                  <CardBody className="flex gap-3 overflow-x-hidden">
                    <AnimatePresence initial={false}>
                      {arr.map((val, idx) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          key={idx}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="
                          w-full flex items-center justify-between
                          rounded-xl border
                          px-3 py-2
                          text-sm
                          bg-danger-50 dark:bg-danger-50
                          border-danger-400/60 dark:border-danger-400/60
                          shadow-sm
                          "
                            >
                              <span className="opacity-80 font-bold">
                                {val}
                              </span>
                              <span className="text-danger text-xs font-medium">
                                4 yanlış
                              </span>
                            </div>
                            <Button
                              isIconOnly
                              variant="shadow"
                              color="danger"
                              size="sm"
                              onPress={() => {
                                const newArr = [...arr];
                                const idx = newArr.indexOf(val);
                                newArr.splice(idx, 1);
                                setArr(newArr);
                              }}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardBody>
                </Card>
              </div>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
}

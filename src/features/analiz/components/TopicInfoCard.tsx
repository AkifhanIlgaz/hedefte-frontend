import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { CircularProgress } from "@heroui/progress";
import { NumberInput } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function TopicInfoCard() {
  const [arr, setArr] = useState<Array<number>>([]);

  return (
    <>
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
              value: "text-3xl font-semibold text-black dark:text-white",
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
          <Button onPress={() => setArr((prev) => [...prev, Math.random()])}>
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
                    <span className="opacity-80 font-bold">{val}</span>
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
    </>
  );
}

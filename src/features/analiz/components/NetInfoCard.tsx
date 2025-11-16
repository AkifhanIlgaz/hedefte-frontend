import { AnimatedNumber } from "@/src/shared/components/animatedNumber";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { NumberInput } from "@heroui/react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { LessonName } from "../types";

interface NetInfoCardProps {
  lessonName: LessonName;
}

export default function NetInfoCard({ lessonName }: NetInfoCardProps) {
  const form = useFormContext();

  const correct = form.watch(`${lessonName}.correct`) as number;
  const wrong = form.watch(`${lessonName}.wrong`) as number;
  const net = (correct ?? 0) - (wrong ?? 0) * 0.25;

  return (
    <Card className="p-3 ">
      <CardHeader className="flex flex-col items-center justify-between">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-6xl">
            <AnimatedNumber
              value={net}
              springOptions={{
                bounce: 0,
                duration: 500,
              }}
            />
          </h1>
          <div className="flex gap-5">
            <span className="text-success">
              {form.watch(`${lessonName}.correct`)} D
            </span>
            <span className="text-danger">
              {form.watch(`${lessonName}.wrong`)} Y
            </span>
            <span className="text-default-600">
              {form.watch(`${lessonName}.empty`)} B
            </span>
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
          value={form.watch(`${lessonName}.correct`)}
          errorMessage={
            form.formState.errors[`${lessonName}.correct`]?.message as string
          }
          isInvalid={!!form.formState.errors[`${lessonName}.correct`]}
          onInput={(e) => {
            form.setValue(
              `${lessonName}.correct`,
              parseInt(e.currentTarget.value) || 0,
            );
            form.trigger(`${lessonName}`);
          }}
          size="sm"
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
          value={form.watch(`${lessonName}.wrong`)}
          errorMessage={
            form.formState.errors[`${lessonName}.wrong`]?.message as string
          }
          isInvalid={!!form.formState.errors[`${lessonName}.wrong`]}
          onInput={(e) => {
            form.setValue(
              `${lessonName}.wrong`,
              parseInt(e.currentTarget.value) || 0,
            );
            form.trigger(`${lessonName}`);
          }}
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
          value={form.watch(`${lessonName}.empty`)}
          errorMessage={
            form.formState.errors[`${lessonName}.empty`]?.message as string
          }
          isInvalid={!!form.formState.errors[`${lessonName}.empty`]}
          onInput={(e) => {
            form.setValue(
              `${lessonName}.empty`,
              parseInt(e.currentTarget.value) || 0,
            );
            form.trigger(`${lessonName}`);
          }}
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
          value={form.watch(`${lessonName}.time`)}
          errorMessage={
            form.formState.errors[`${lessonName}.time`]?.message as string
          }
          isInvalid={!!form.formState.errors[`${lessonName}.time`]}
          onInput={(e) =>
            form.setValue(
              `${lessonName}.time`,
              parseInt(e.currentTarget.value) || 0,
            )
          }
          classNames={{
            label: "text-xs",
            input: "text-center",
          }}
        />
      </CardBody>
      <CardFooter className="pt-0">
        {form.formState.errors[lessonName] && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="
               flex items-center gap-2 text-sm
              text-danger-600 dark:text-danger-400
              bg-danger-50 dark:bg-danger-950/40
              p-2 rounded-lg
            "
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            {form.formState.errors[lessonName]?.message as string}
          </motion.p>
        )}
      </CardFooter>
    </Card>
  );
}

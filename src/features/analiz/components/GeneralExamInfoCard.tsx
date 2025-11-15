import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { DatePicker, DateValue } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { useSearchParams } from "next/navigation";
import { Exam } from "../types";
import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";
import { I18nProvider } from "@react-aria/i18n";
import { error } from "console";
import { parseDate } from "@internationalized/date";

interface GeneralExamInfoCardProps {
  exam: Exam;
}

export default function GeneralExamInfoCard({
  exam,
}: GeneralExamInfoCardProps) {
  const {
    register,

    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  return (
    <Card className="p-3">
      <CardHeader className="flex flex-col items-start">
        <span className="text-md font-bold">Sınav Bilgileri</span>
        <span className="text-xs text-default-500">
          Çözdüğün denemenin tarihini ve ismini buradan düzenleyebilirsin.
        </span>
      </CardHeader>
      <CardBody>
        <div className="flex gap-5  justify-center items-start ">
          <Input
            type="text"
            label="Sınav"
            labelPlacement="outside-top"
            value={exam}
            isReadOnly
            classNames={{
              label: "text-xs font-semibold",
            }}
          />

          <I18nProvider locale="tr-TR">
            <DatePicker
              label="Deneme Tarihi"
              labelPlacement="outside"
              errorMessage={errors.date?.message as string}
              isInvalid={!!errors.date}
              classNames={{
                label: "text-xs font-semibold",
              }}
              onChange={(date) => {
                if (date) {
                  const dateObj = new Date(date.year, date.month, date.day);
                  setValue("date", dateObj);
                  clearErrors("date");
                }
              }}
            />
          </I18nProvider>

          <Input
            type="text"
            label="Deneme İsmi"
            placeholder="Lütfen çözdüğünüz denemenin ismini giriniz."
            labelPlacement="outside-top"
            {...register("name")}
            errorMessage={errors.name?.message as string}
            isInvalid={!!errors.name}
            classNames={{
              label: "text-xs font-semibold",
            }}
          />
        </div>
      </CardBody>
    </Card>
  );
}

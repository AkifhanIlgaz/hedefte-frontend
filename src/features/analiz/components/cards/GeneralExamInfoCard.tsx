import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/react";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { useFormContext } from "react-hook-form";
import { Exam } from "../../types";

interface GeneralExamInfoCardProps {
  exam: Exam;
}

export default function GeneralExamInfoCard({
  exam,
}: GeneralExamInfoCardProps) {
  const {
    register,
    setValue,
    trigger,
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
        <div className="md:flex  md:gap-5  justify-center items-start ">
          <Input
            type="text"
            label="Sınav"
            labelPlacement="outside-top"
            value={exam.split("_").join(" ")}
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
              maxValue={today(getLocalTimeZone())}
              isInvalid={!!errors.date}
              classNames={{
                label: "text-xs font-semibold",
              }}
              onChange={(date: DateValue | null) => {
                if (date) {
                  setValue("date", date.toDate(`Europe/Istanbul`));
                  trigger("date");
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

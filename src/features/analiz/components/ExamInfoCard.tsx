import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { useSearchParams } from "next/navigation";
import { Exam } from "../types";

interface GeneralExamInfoCardProps {
  exam: Exam;
}

export default function GeneralExamInfoCard({
  exam,
}: GeneralExamInfoCardProps) {
  return (
    <Card className="p-3">
      <CardHeader className="flex flex-col items-start">
        <span className="text-md font-bold">Sınav Bilgileri</span>
        <span className="text-xs text-default-500">
          Çözdüğün denemenin tarihini ve ismini buradan düzenleyebilirsin.
        </span>
      </CardHeader>
      <CardBody>
        <div className="flex gap-5 items-end justify-center">
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
  );
}

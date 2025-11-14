import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";

export default function GeneralExamInfoCard() {
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
  );
}

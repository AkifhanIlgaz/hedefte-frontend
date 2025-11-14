import { Card, CardHeader, CardBody } from "@heroui/card";
import { NumberInput } from "@heroui/react";

export default function NetInfoCard() {
  return (
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
  );
}

import { AnimatedNumber } from "@/src/shared/components/animatedNumber";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { NumberInput } from "@heroui/react";
import { useEffect, useState } from "react";

export default function NetInfoCard() {
  const [net, setNet] = useState<number>(0);
  const [correct, setCorrect] = useState<number>();
  const [wrong, setWrong] = useState<number>();
  const [empty, setEmpty] = useState<number>();
  const [time, setTime] = useState<number>();

  useEffect(() => {
    const newNet = (correct ?? 0) - (wrong ?? 0) * 0.25;
    setNet(newNet);
  }, [correct, wrong]);

  return (
    <Card className="p-3 max-h-fit">
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
            <span className="text-success">{correct} D</span>
            <span className="text-danger">{wrong} Y</span>
            <span className="text-default-600">{empty} B</span>
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
          value={correct}
          onInput={(e) =>
            setCorrect(e.currentTarget.value as unknown as number)
          }
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
          value={wrong}
          onInput={(e) => setWrong(e.currentTarget.value as unknown as number)}
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
          value={empty}
          onInput={(e) => setEmpty(e.currentTarget.value as unknown as number)}
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
          value={time}
          onValueChange={setTime}
          classNames={{
            label: "text-xs",
            input: "text-center",
          }}
        />
      </CardBody>
    </Card>
  );
}

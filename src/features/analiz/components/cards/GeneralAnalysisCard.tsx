import { Card, CardBody, CardHeader } from "@heroui/card";
import { LucideIcon } from "lucide-react";

interface GeneralAnalysisCardProps {
  title: string;
  value?: number | string;
  icon: LucideIcon;
}

export default function GeneralAnalysisCard({
  title,
  value,
  icon: Icon,
}: GeneralAnalysisCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm ">
      <CardHeader className="flex flex-row items-center justify-center gap-2">
        <Icon className="size-5 text-muted-foreground" />
        {title}
      </CardHeader>
      <CardBody className="w-full h-full">
        <h1 className="text-7xl font-bold text-foreground text-center ">
          {value}
        </h1>
      </CardBody>
    </Card>
  );
}

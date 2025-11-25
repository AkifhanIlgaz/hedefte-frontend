"use client";

import { Button } from "@heroui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Button className="bg-transparent" isIconOnly onPress={router.back}>
        <ChevronLeft />
      </Button>
      <div className="flex flex-col items-start justify-center ">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-default-500">{description}</p>
      </div>
    </div>
  );
}

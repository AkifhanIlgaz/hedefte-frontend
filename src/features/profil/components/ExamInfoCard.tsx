"use client";

import {
  departments,
  exams,
  Field,
  fields,
  universities,
} from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Key, useEffect, useState } from "react";
import { ExamInfo } from "../types";
import { Select, SelectItem, SelectSection } from "@heroui/select";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/autocomplete";

interface ExamInfoCardProps {
  examInfo?: ExamInfo;
}

export default function ExamInfoCard({ examInfo }: ExamInfoCardProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(
    examInfo?.university ?? null,
  );
  const [department, setDepartment] = useState(examInfo?.department ?? "");
  const [exam, setExam] = useState(examInfo?.exam ?? "");
  const [field, setField] = useState(examInfo?.field ?? "");
  const [loading, setLoading] = useState(false);

  return (
    <Card className="p-3">
      <CardHeader className="flex flex-col items-start">
        <span className="text-md font-bold">Hedef ve Sınav Bilgileri</span>
        <span className="text-xs text-default-500">
          Hedeflediğin üniversite, bölüm ve gireceğin sınav alanını buradan
          belirleyebilirsin.
        </span>
      </CardHeader>
      <CardBody className="gap-4">
        <Autocomplete
          isVirtualized
          label="Hedef Üniversite"
          labelPlacement="outside"
          size="sm"
          placeholder="Lütfen hedeflediğiniz üniversiteyi seçiniz."
        >
          {universities.map((university) => (
            <AutocompleteItem key={university}>{university}</AutocompleteItem>
          ))}
        </Autocomplete>

        <Autocomplete
          isVirtualized
          label="Hedef Bölüm"
          labelPlacement="outside"
          size="sm"
          placeholder="Lütfen hedeflediğiniz bölümü seçiniz."
        >
          {departments.map((department) => (
            <AutocompleteItem key={department}>{department}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Autocomplete
          isVirtualized
          label="Sınav"
          labelPlacement="outside"
          size="sm"
          maxListboxHeight={72}
          placeholder="Lütfen gireceğiniz sınavı seçiniz."
        >
          {exams.map((exam) => (
            <AutocompleteItem key={exam}>{exam}</AutocompleteItem>
          ))}
        </Autocomplete>

        <Autocomplete
          isVirtualized
          label="Alan"
          labelPlacement="outside"
          size="sm"
          maxListboxHeight={144}
          placeholder="Lütfen sınava gireceğiniz alanı seçiniz."
        >
          {fields.map((field) => (
            <AutocompleteItem key={field}>{field}</AutocompleteItem>
          ))}
        </Autocomplete>
      </CardBody>
      <CardFooter className="flex w-full  justify-end">
        <Button size="sm" color="primary">
          Kaydet
        </Button>
      </CardFooter>
    </Card>
  );
}

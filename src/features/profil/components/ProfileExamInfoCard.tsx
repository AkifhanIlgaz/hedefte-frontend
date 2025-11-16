"use client";

import {
  departments,
  exams,
  fields,
  universities,
} from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";
import { ExamInfo } from "../types";

export default function ProfileExamInfoCard() {
  const [examInfo, setExamInfo] = useState<ExamInfo>({
    university: "",
    department: "",
    exam: "",
    field: "",
  });
  const [loading, setLoading] = useState(false);

  const updateExamInfo = async () => {
    setLoading(true);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          examInfo,
        },
      });
      if (error) throw error;
      addToast({
        title: "Güncelleme başarılı !",
        description: "Hedef ve sınav bilgileriniz başarıyla kaydedildi.",
        color: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Bir hata oluştu !",
        description: error?.message ?? "Lütfen daha sonra tekrar deneyin.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) console.error("Kullanıcı bilgisi alınamadı:", error.message);

      const examInfo = data.user?.user_metadata["examInfo"] as ExamInfo;

      setExamInfo(examInfo);
    };

    getUser();
  }, []);

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
          selectedKey={examInfo?.university}
          onSelectionChange={(key) => {
            setExamInfo((prev) => ({
              ...prev,
              university: key as string,
            }));
          }}
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
          selectedKey={examInfo?.department}
          onSelectionChange={(key) => {
            setExamInfo((prev) => ({
              ...prev,
              department: key as string,
            }));
          }}
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
          selectedKey={examInfo?.exam}
          onSelectionChange={(key) => {
            setExamInfo((prev) => ({
              ...prev,
              exam: key as string,
            }));
          }}
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
          selectedKey={examInfo?.field}
          onSelectionChange={(key) => {
            setExamInfo((prev) => ({
              ...prev,
              field: key as string,
            }));
          }}
          maxListboxHeight={144}
          placeholder="Lütfen sınava gireceğiniz alanı seçiniz."
        >
          {fields.map((field) => (
            <AutocompleteItem key={field}>{field}</AutocompleteItem>
          ))}
        </Autocomplete>
      </CardBody>
      <CardFooter className="flex w-full  justify-end">
        <Button
          size="sm"
          color="primary"
          onPress={updateExamInfo}
          isLoading={loading}
        >
          Kaydet
        </Button>
      </CardFooter>
    </Card>
  );
}

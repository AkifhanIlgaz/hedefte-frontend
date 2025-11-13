"use client";

import ExamInfoCard from "@/src/features/profil/components/ExamInfoCard";
import { Field } from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
};

type ExamInfo = {
  exam: string;
  university: string;
  department: string;
  field: Field;
};

export default function Page() {
  // Sayfa yuklendiginde bilgileri cek ve doldur
  // Kaydete basarsa update user
  const updateUserInfo = async (
    personalInfo: PersonalInfo,
    examInfo: ExamInfo,
  ) => {};

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) console.error("Kullanıcı bilgisi alınamadı:", error.message);

      const personalInfo = data.user?.user_metadata[
        "personalInfo"
      ] as PersonalInfo;

      const examInfo = data.user?.user_metadata["personalInfo"] as PersonalInfo;

      console.log();
    };

    getUser();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-3">
        <CardHeader className="flex flex-col items-start">
          <span className="text-md font-bold">Kişisel Bilgiler</span>
          <span className="text-xs text-default-500">
            Kendinle ilgili temel bilgileri burada görüntüleyebilir ve
            güncelleyebilirsin.
          </span>
        </CardHeader>
        <CardBody className="gap-4">
          <Input
            size="sm"
            type="text"
            label="Isim"
            labelPlacement="outside-top"
          />
          <Input
            size="sm"
            type="text"
            label="Soy Isim"
            labelPlacement="outside-top"
          />

          <Input
            size="sm"
            type="text"
            label="Mail"
            labelPlacement="outside-top"
          />
        </CardBody>
        <CardFooter className="flex w-full  justify-end">
          <Button size="sm" color="primary">
            Kaydet
          </Button>
        </CardFooter>
      </Card>

      <ExamInfoCard />
    </div>
  );
}

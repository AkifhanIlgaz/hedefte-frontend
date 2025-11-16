"use client";

import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useEffect, useState } from "react";
import { PersonalInfo } from "../types";

export default function PersonalInfoCard() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const updatePersonalInfo = async () => {
    setLoading(true);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          personalInfo,
        },
      });
      if (error) throw error;
      addToast({
        title: "Güncelleme başarılı !",
        description: "Profil bilgileriniz başarıyla kaydedildi.",
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

      const personalInfo = data.user?.user_metadata[
        "personalInfo"
      ] as PersonalInfo;

      setPersonalInfo(personalInfo);
    };

    getUser();
  }, []);

  return (
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
          label="Ad"
          value={personalInfo?.firstName}
          onValueChange={(val) => {
            setPersonalInfo((prev) => ({ ...prev, firstName: val }));
          }}
          labelPlacement="outside-top"
        />
        <Input
          size="sm"
          type="text"
          label="Soyad"
          value={personalInfo?.lastName}
          onValueChange={(val) => {
            setPersonalInfo((prev) => ({ ...prev, lastName: val }));
          }}
          labelPlacement="outside-top"
        />

        <Input
          size="sm"
          type="email"
          label="E-mail"
          value={personalInfo?.email}
          isReadOnly
          labelPlacement="outside-top"
        />
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button
          size="sm"
          color="primary"
          onPress={updatePersonalInfo}
          isLoading={loading}
        >
          Kaydet
        </Button>
      </CardFooter>
    </Card>
  );
}

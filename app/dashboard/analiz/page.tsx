"use client";

import { Field } from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
import DashboardHeader from "@/src/shared/components/dashboardHeader";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [field, setField] = useState<Field | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      const userField = user?.user_metadata?.examInfo?.field as Field;
      setField(userField ?? "Sayısal");
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Deneme Analizlerim"
        description="Çözdüğün denemelerinizi burada görebilirsiniz."
      />
      <Button as={Link} href={`/dashboard/analiz/ekle?exam=TYT`}>
        TYT Analiz Ekle
      </Button>

      <Button as={Link} href={`/dashboard/analiz/ekle?exam=AYT&field=${field}`}>
        AYT Analiz Ekle
      </Button>
    </div>
  );
}

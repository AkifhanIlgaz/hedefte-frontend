"use client";

import { Field } from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
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
    <div>
      <Button as={Link} href={`/dashboard/analiz/ekle?exam=TYT`}>
        TYT Analiz Ekle
      </Button>

      <Button as={Link} href={`/dashboard/analiz/ekle?exam=AYT&field=${field}`}>
        AYT Analiz Ekle
      </Button>
    </div>
  );
}

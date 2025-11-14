"use client";

import ExamInfoCard from "@/src/features/profil/components/ExamInfoCard";
import PersonalInfoCard from "@/src/features/profil/components/PersonalInfoCard";
import { Field } from "@/src/features/profil/data";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";

export default function Page() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <PersonalInfoCard />
      <ExamInfoCard />
    </div>
  );
}

"use client";

import PersonalInfoCard from "@/src/features/profil/components/PersonalInfoCard";
import ProfileExamInfoCard from "@/src/features/profil/components/ProfileExamInfoCard";

export default function Page() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <PersonalInfoCard />
      <ProfileExamInfoCard />
    </div>
  );
}

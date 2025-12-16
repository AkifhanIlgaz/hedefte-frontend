"use client";

import { ResetPasswordForm } from "@/src/features/auth/components";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

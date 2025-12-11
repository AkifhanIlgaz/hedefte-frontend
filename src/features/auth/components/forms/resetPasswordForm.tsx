"use client";

import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Input } from "@heroui/input";

import { useResetPassword } from "@/src/lib/queries/useResetPassword";
import { Link } from "@heroui/link";
import { authRoutes } from "../../auth.routes";
import { authText } from "../../auth.text";
import { ResetPasswordRequest, resetPasswordSchema } from "../../schemas";
import { AuthMessage } from "../shared/authMessage";
import AuthHeader from "../shared/header";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code");
  const { mutate, status, error, reset, isPending } = useResetPassword();
  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (req: ResetPasswordRequest) => {
    mutate(req);
  };

  if (errorCode == "otp_expired") {
    return (
      <AuthMessage
        variant="error"
        title="Bağlantı geçersiz."
        message={"Bu bağlantı geçersiz veya süresi dolmuş."}
        extraNote="Lütfen yeni bir şifre sıfırlama bağlantısı alın."
        reset={reset}
        backHref={authRoutes.login}
        backText="Giriş Sayfasına Dön"
      />
    );
  }

  if (error) {
    return (
      <AuthMessage
        variant="error"
        title="Bir şeyler ters gitti"
        message={error.message}
        reset={reset}
        backHref={authRoutes.login}
        backText="Giriş Sayfasına Dön"
      />
    );
  }
  return (
    <div className="space-y-8">
      <AuthHeader
        title={authText.createNewPassword}
        subtitle={authText.createNewPasswordSubtitle}
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={authText.placeholders.password}
          label={authText.labels.password}
          labelPlacement="outside-top"
          errorMessage={form.formState.errors.password?.message}
          isInvalid={!!form.formState.errors.password}
          endContent={
            <Button
              onPress={() => setShowPassword(!showPassword)}
              isIconOnly
              className="bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          }
          {...form.register("password")}
        />

        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder={authText.placeholders.confirmPassword}
          label={authText.labels.confirmPassword}
          labelPlacement="outside-top"
          errorMessage={form.formState.errors.confirmPassword?.message}
          isInvalid={!!form.formState.errors.confirmPassword}
          endContent={
            <Button
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              isIconOnly
              className="bg-transparent"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          }
          {...form.register("confirmPassword")}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full "
            color="primary"
            isDisabled={isPending}
            isLoading={isPending}
          >
            {isPending
              ? authText.updatingPassword
              : authText.buttons.updatePassword}
          </Button>

          <Button
            as={Link}
            variant="ghost"
            startContent={<ArrowLeft className="w-4 h-4 mr-2" />}
            className="w-full"
            href={authRoutes.login}
          >
            {authText.buttons.returnLogin}
          </Button>
        </div>
      </form>
    </div>
  );
}

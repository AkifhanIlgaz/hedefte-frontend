"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@heroui/button";

import { Input } from "@heroui/input";

import { useRegister } from "@/src/lib/queries/auth/useRegister";
import { Link } from "@heroui/link";
import { authRoutes } from "../../auth.routes";
import { authText } from "../../auth.text";
import { RegisterRequest, registerSchema } from "../../schemas";
import { AuthMessage } from "../shared/authMessage";
import AuthHeader from "../shared/header";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutateAsync, status, error, reset } = useRegister();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (req: RegisterRequest) => {
    await mutateAsync(req);
  };

  switch (status) {
    case "success":
      return (
        <AuthMessage
          variant="success"
          title="E-posta doğrulaması gerekli"
          reset={reset}
          message="Lütfen hesabını aktifleştirmek için e-posta adresini kontrol et."
          extraNote={authText.checkSpam}
          backHref={authRoutes.login}
          backText="Giriş Sayfasına Dön"
        />
      );
    case "error":
      return (
        <AuthMessage
          variant="error"
          title="Bir şeyler ters gitti"
          message={error.message ?? "Beklenmeyen bir hata oluştu."}
          reset={reset}
          backHref={authRoutes.login}
          backText="Giriş Sayfasına Dön"
        />
      );
  }

  return (
    <div className="space-y-8">
      <AuthHeader
        title={authText.registerTitle}
        subtitle={authText.registerSubtitle}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder={authText.placeholders.firstName}
            labelPlacement="outside-top"
            label={authText.labels.firstName}
            errorMessage={form.formState.errors.firstName?.message}
            isInvalid={!!form.formState.errors.firstName}
            {...form.register("firstName")}
          />

          <Input
            type="text"
            placeholder={authText.placeholders.lastName}
            labelPlacement="outside-top"
            label={authText.labels.lastName}
            errorMessage={form.formState.errors.lastName?.message}
            isInvalid={!!form.formState.errors.lastName}
            {...form.register("lastName")}
          />
        </div>

        <Input
          type="email"
          placeholder={authText.placeholders.email}
          labelPlacement="outside-top"
          label={authText.labels.email}
          errorMessage={form.formState.errors.email?.message}
          isInvalid={!!form.formState.errors.email}
          {...form.register("email")}
        />

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

        <Button
          type="submit"
          className="w-full "
          disabled={status === "pending"}
          isLoading={status === "pending"}
          color="primary"
        >
          <span>
            {status === "pending"
              ? authText.creatingAccount
              : authText.buttons.register}
          </span>
        </Button>

        <p className="text-center text-sm text-default-500">
          {authText.alreadyHaveAccount}
          <Link
            href={authRoutes.login}
            className="ml-2 text-primary text-sm hover:text-primary/80 font-medium"
          >
            {authText.buttons.login}
          </Link>
        </p>
      </form>
    </div>
  );
}

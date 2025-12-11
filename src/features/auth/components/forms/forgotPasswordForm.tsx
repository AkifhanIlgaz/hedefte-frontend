"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { useForgotPassword } from "@/src/lib/queries/useForgotPassword";
import { Link } from "@heroui/link";
import { authRoutes } from "../../auth.routes";
import { authText } from "../../auth.text";
import { ForgotPasswordRequest, forgotPasswordSchema } from "../../schemas";
import { AuthMessage } from "../shared/authMessage";
import AuthHeader from "../shared/header";

export default function ForgotPasswordForm() {
  const { mutate, status, error, reset, isPending } = useForgotPassword();
  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (req: ForgotPasswordRequest) => {
    mutate(req);
  };

  switch (status) {
    case "success":
      return <Submitted email={form.getValues().email} />;
    case "error":
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
        title={authText.forgotPassword}
        subtitle={authText.enterEmail}
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Input
          type="email"
          placeholder={authText.placeholders.email}
          labelPlacement="outside-top"
          label={authText.labels.email}
          errorMessage={form.formState.errors.email?.message}
          isInvalid={!!form.formState.errors.email}
          {...form.register("email")}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full "
            color="primary"
            isDisabled={isPending}
            isLoading={isPending}
          >
            {isPending ? authText.sendingLink : authText.buttons.sendResetLink}
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

interface SubmittedProps {
  email: string;
}

function Submitted({ email }: SubmittedProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {authText.checkEmail}
          </h1>
          <p className="text-default-500">
            Şifre sıfırlama bağlantısını{" "}
            <span className="font-medium text-foreground">{email}</span>{" "}
            adresine gönderdik.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-default-50 border border-default-200 rounded-lg">
          <p className="text-sm text-default-600">{authText.checkSpam}</p>
        </div>

        <Button
          as={Link}
          href={authRoutes.login}
          variant="ghost"
          color="primary"
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {authText.buttons.returnLogin}
        </Button>
      </div>
    </div>
  );
}

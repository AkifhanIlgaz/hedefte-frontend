"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAuthApiError } from "@supabase/supabase-js";
import { Button } from "@heroui/button";

import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";

import { authRoutes } from "../../auth.routes";
import { authText } from "../../auth.text";
import {
  ForgotPasswordRequest,
  forgotPasswordSchema,
  LoginRequest,
  loginSchema,
  ResetPasswordRequest,
  resetPasswordSchema,
} from "../../schemas";
import { Link } from "@heroui/link";
import AuthHeader from "../shared/header";
import { createClient } from "@/src/lib/supabase/client";
import { AuthMessage } from "../shared/authMessage";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code");

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (req: ResetPasswordRequest) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.updateUser({
        password: req.password,
      });
      if (error) throw error;

      router.push("/protected");
    } catch (error: unknown) {
      if (isAuthApiError(error)) {
        switch (error.code) {
          case "same_password":
            setError("Yeni şifreniz eski şifreniz ile aynı olamaz.");
            break;
          default:
            setError("Bir hata meydana geldi. Lütfen tekrar deneyiniz.");
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (errorCode == "otp_expired") {
    return (
      <AuthMessage
        variant="error"
        title="Bağlantı geçersiz."
        message={"Bu bağlantı geçersiz veya süresi dolmuş."}
        extraNote="Lütfen yeni bir şifre sıfırlama bağlantısı alın."
        setError={setError}
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
        message={error}
        setError={setError}
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
          <Button type="submit" className="w-full " color="primary">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {authText.updatingPassword}
              </>
            ) : (
              authText.buttons.updatePassword
            )}
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

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@heroui/button";

import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";

import { authRoutes } from "../../auth.routes";
import { authText } from "../../auth.text";
import { LoginRequest, loginSchema } from "../../schemas";
import { Link } from "@heroui/link";
import { AuthMessage } from "../shared/authMessage";
import AuthHeader from "../shared/header";
import SignInWithGoogle from "../shared/signInWithGoogle";
import AuthDivider from "../shared/divider";
import { createClient } from "@/src/lib/supabase/client";
import {
  isAuthApiError,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (req: LoginRequest) => {
    setIsLoading(true);
    const supabase = createClient();

    const credentials: SignInWithPasswordCredentials = {
      email: req.email,
      password: req.password,
    };

    try {
      const res = await supabase.auth.signInWithPassword(credentials);
      if (res.error) throw res.error;

      router.push("/protected");
    } catch (error: unknown) {
      if (isAuthApiError(error)) {
        switch (error.code) {
          case "invalid_credentials":
            setError("E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.");
            break;
          case "email_not_confirmed":
            setError("E-posta adresinizi doğrulamanız gerekiyor.");
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
        title={authText.welcomeBack}
        subtitle={authText.signInSubtitle}
      />
      <SignInWithGoogle />
      <AuthDivider />
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

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" defaultChecked />
            <span className="cursor-pointer text-sm">
              {authText.labels.rememberMe}
            </span>
          </div>

          <span
            onClick={() => router.push(authRoutes.forgotPassword)}
            className="text-sm text-primary hover:text-primary/80 cursor-pointer"
          >
            {authText.labels.forgotPassword}
          </span>
        </div>

        <Button
          type="submit"
          className="w-full "
          disabled={isLoading}
          color="primary"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              <span>{authText.signingIn}</span>
            </div>
          ) : (
            authText.buttons.login
          )}
        </Button>

        <p className="text-center text-sm text-default-500">
          {authText.dontHaveAccount}
          <Link
            href={authRoutes.register}
            className="ml-2 text-primary text-sm hover:text-primary/80 font-medium"
          >
            {authText.buttons.register}
          </Link>
        </p>
      </form>
    </div>
  );
}

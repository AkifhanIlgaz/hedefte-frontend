"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@heroui/button";

import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";

import { useLogin } from "@/src/lib/queries/useLogin";
import { Link } from "@heroui/link";
import { addToast } from "@heroui/toast";
import { authRoutes } from "../../auth.routes";
import { authText } from "../../auth.text";
import { mapAuthError } from "../../auth.utils";
import { LoginRequest, loginSchema } from "../../schemas";
import AuthDivider from "../shared/divider";
import AuthHeader from "../shared/header";
import SignInWithGoogle from "../shared/signInWithGoogle";

export default function LoginForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (req: LoginRequest) => {
    try {
      await mutateAsync(req);
      addToast({
        shouldShowTimeoutProgress: true,
        title: "Hoşgeldiniz!",
        variant: "flat",
        description: "Giriş başarılı.",
        color: "success",
      });
      router.push("/dashboard");
    } catch (error) {
      addToast({
        title: "Giriş başarısız",
        description: mapAuthError(error),
        color: "danger",
      });
    }
  };

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
          disabled={isPending}
          isLoading={isPending}
          color="primary"
        >
          {isPending ? authText.signingIn : authText.buttons.login}
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

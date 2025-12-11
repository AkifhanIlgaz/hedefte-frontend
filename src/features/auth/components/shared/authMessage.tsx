import { cn } from "@/src/lib/utils";
import { Button } from "@heroui/button";
import { ArrowLeft, Check, XCircle } from "lucide-react";
import Link from "next/link";

type Variant = "success" | "error";

interface AuthMessageProps {
  variant?: Variant;
  title: string;
  message: string;
  reset: () => void;
  email?: string;
  extraNote?: string;
  backHref: string;
  backText: string;
}

const icons = {
  success: Check,
  error: XCircle,
};

const colors = {
  success: "success",
  error: "danger",
};

export function AuthMessage({
  variant = "success",
  title,
  message,
  reset,
  email,
  extraNote,
  backHref,
  backText,
}: AuthMessageProps) {
  const Icon = icons[variant];
  const color = colors[variant];

  return (
    <div className="space-y-4 text-center">
      <div>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Icon className={cn("w-8 h-8", `text-${color}`)} />
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">{title}</h1>
        <p className="text-default-500">
          {message}{" "}
          {email && (
            <span className="font-medium text-foreground">{email}</span>
          )}
        </p>
      </div>

      {extraNote && (
        <div className="p-4 bg-default-50 border border-default-200 rounded-lg">
          <p className="text-sm text-default-600">{extraNote}</p>
        </div>
      )}

      <Button
        as={Link}
        href={backHref}
        variant="ghost"
        onPress={reset}
        color={variant === "error" ? "danger" : "primary"}
        className="w-full"
        startContent={<ArrowLeft className="w-4 h-4 mr-2" />}
      >
        {backText}
      </Button>
    </div>
  );
}

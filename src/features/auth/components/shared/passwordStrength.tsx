import { Check } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = [
    { label: "En az 8 karakter", test: (pwd: string) => pwd.length >= 8 }, // PASSWORD_MIN_LENGTH_TEXT
    { label: "Büyük harf içerir", test: (pwd: string) => /[A-Z]/.test(pwd) }, // PASSWORD_UPPERCASE_TEXT
    { label: "Küçük harf içerir", test: (pwd: string) => /[a-z]/.test(pwd) }, // PASSWORD_LOWERCASE_TEXT
    { label: "Sayı içerir", test: (pwd: string) => /\d/.test(pwd) }, // PASSWORD_NUMBER_TEXT
  ];

  const strength = requirements.filter((req) => req.test(password)).length;
  const strengthColors = ["bg-danger", "bg-danger", "bg-warning", "bg-success"];
  const strengthText = ["Zayıf", "Kötü", "İyi", "Güçlü"]; // PASSWORD_STRENGTH_LABELS

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-default-200 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              password
                ? strengthColors[strength - 1] || "bg-default-200"
                : "bg-default-200"
            }`}
            style={{ width: `${(strength / requirements.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-default-500">
          {password ? strengthText[strength - 1] || "Çok Zayıf" : ""}{" "}
          {/* PASSWORD_STRENGTH_DEFAULT */}
        </span>
      </div>

      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                req.test(password) ? "bg-success" : "bg-default-200"
              }`}
            >
              {req.test(password) && <Check className="w-2 h-2 text-white" />}
            </div>
            <span
              className={`text-xs ${
                req.test(password) ? "text-success" : "text-default-400"
              }`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

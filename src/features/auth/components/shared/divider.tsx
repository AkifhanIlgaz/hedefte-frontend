import { authText } from "../../auth.text";

export default function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-default-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-background text-default-500">
          {authText.withEmail}
        </span>
      </div>
    </div>
  );
}

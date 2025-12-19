import { ForgotPasswordRequest } from "@/src/features/auth/schemas";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (req: ForgotPasswordRequest) => authService.forgotPassword(req),
  });
}

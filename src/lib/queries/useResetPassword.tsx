import { ResetPasswordRequest } from "@/src/features/auth/schemas";
import { useMutation } from "@tanstack/react-query";
import authService from "../services/authService";

export function useResetPassword() {
  return useMutation({
    mutationFn: (req: ResetPasswordRequest) => authService.resetPassword(req),
  });
}

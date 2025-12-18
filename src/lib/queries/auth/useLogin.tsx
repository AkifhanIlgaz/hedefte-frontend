import { LoginRequest } from "@/src/features/auth/schemas";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";

export function useLogin() {
  return useMutation({
    mutationFn: (req: LoginRequest) => authService.login(req),
  });
}

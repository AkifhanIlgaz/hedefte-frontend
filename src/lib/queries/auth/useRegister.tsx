import { RegisterRequest } from "@/src/features/auth/schemas";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";

export function useRegister() {
  return useMutation({
    mutationFn: (req: RegisterRequest) => authService.register(req),
  });
}

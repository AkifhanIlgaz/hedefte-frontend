import { useMutation } from "@tanstack/react-query";
import authService from "../services/authService";

export function useLogin() {
  return useMutation({
    mutationFn: (dto: { email: string; password: string }) =>
      authService.login(dto.email, dto.password),
  });
}

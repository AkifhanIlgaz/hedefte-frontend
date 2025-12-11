import {
  ForgotPasswordRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "@/src/features/auth/schemas";
import {
  isAuthApiError,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

class AuthService {
  private supabase = createClient();

  async login(email: string, password: string) {
    try {
      const { error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
    } catch (error: unknown) {
      if (isAuthApiError(error)) {
        switch (error.code) {
          case "invalid_credentials":
            throw new Error(
              "E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.",
            );
          case "email_not_confirmed":
            throw new Error("E-posta adresinizi doğrulamanız gerekiyor.");
          default:
            throw new Error("Bir hata meydana geldi. Lütfen tekrar deneyiniz.");
        }
      }
    }
  }

  async register(req: RegisterRequest) {
    try {
      const credentials: SignUpWithPasswordCredentials = {
        email: req.email,
        password: req.password,
        options: {
          data: {
            personalInfo: {
              firstName: req.firstName,
              lastName: req.lastName,
              email: req.email,
            },
            examInfo: {},
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      };

      const res = await this.supabase.auth.signUp(credentials);
      if (res.error) throw res.error;

      if (res.data.user?.identities?.length === 0)
        throw new Error("Bu e-posta adresiyle zaten bir hesap var.");
    } catch (error: unknown) {
      if (isAuthApiError(error)) {
        switch (error.code) {
          case "email_exists":
            throw new Error("Bu e-posta adresiyle zaten bir hesap var.");
          case "invalid_credentials":
            throw new Error(
              "E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.",
            );
          default:
            throw new Error("Bir hata meydana geldi. Lütfen tekrar deneyiniz.");
        }
      }
    }
  }

  async forgotPassword(req: ForgotPasswordRequest) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        req.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      );
      if (error) throw error;
    } catch (error) {
      if (isAuthApiError(error)) {
        switch (error.code) {
          case "invalid_credentials":
            throw new Error(
              "E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.",
            );
          default:
            throw new Error("Bir hata meydana geldi. Lütfen tekrar deneyiniz.");
        }
      }
    }
  }

  async resetPassword(req: ResetPasswordRequest) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: req.password,
      });
      if (error) throw error;
    } catch (error) {
      if (isAuthApiError(error)) {
        switch (error.code) {
          case "same_password":
            throw new Error("Yeni şifreniz eski şifreniz ile aynı olamaz.");
          default:
            throw new Error("Bir hata meydana geldi. Lütfen tekrar deneyiniz.");
        }
      }
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
    } catch (error) {
      throw new Error("Bir hata meydana geldi. Lütfen tekrar deneyiniz.");
    }
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();

    return data?.user;
  }
}

export default new AuthService();

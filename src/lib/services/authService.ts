import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "@/src/features/auth/schemas";
import {
  AuthApiError,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

class AuthService {
  private supabase = createClient();

  async login(req: LoginRequest): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: req.email,
      password: req.password,
    });

    if (error) throw new Error(error.message);
  }

  async register(req: RegisterRequest): Promise<void> {
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
      throw new AuthApiError("email_exists", 400, "email_exists");
  }

  async forgotPassword(req: ForgotPasswordRequest): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(
      req.email,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
    );

    if (error) throw error;
  }

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({
      password: req.password,
    });

    if (error) throw error;
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut({ scope: "local" });

    if (error) throw error;
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();

    return data?.user;
  }
}

export default new AuthService();

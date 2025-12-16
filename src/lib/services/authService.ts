import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "@/src/features/auth/schemas";
import {
  AuthApiError,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js/dist/module/index";

import { createClient } from "../supabase/client";

class AuthService {
  async login(req: LoginRequest): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
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
    const supabase = createClient();

    const res = await supabase.auth.signUp(credentials);
    if (res.error) throw res.error;

    if (res.data.user?.identities?.length === 0)
      throw new AuthApiError("email_exists", 400, "email_exists");
  }

  async forgotPassword(req: ForgotPasswordRequest): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(req.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  }

  async resetPassword(req: ResetPasswordRequest): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: req.password,
    });

    if (error) throw error;
  }

  async logout(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) throw error;
  }

  async getUser() {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();

    return data?.user;
  }
}

export default new AuthService();

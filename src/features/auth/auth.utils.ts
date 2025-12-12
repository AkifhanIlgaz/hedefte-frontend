import { isAuthApiError } from "@supabase/supabase-js";

export function mapAuthError(error: unknown): string {
  if (isAuthApiError(error)) {
    switch (error.code) {
      case "invalid_credentials":
        return "E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.";
      case "email_not_confirmed":
        return "E-posta adresinizi doğrulamanız gerekiyor.";
      case "email_exists":
        return "Bu e-posta adresiyle zaten bir hesap var.";
      case "same_password":
        return "Yeni şifreniz eski şifreniz ile aynı olamaz.";
      case "user_not_found":
        return "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.";
      case "weak_password":
        return "Şifreniz yeterince güçlü değil.";
      case "over_email_send_rate_limit":
        return "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyiniz.";
      default:
        return "Bir hata meydana geldi. Lütfen tekrar deneyiniz.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }
  return "Beklenmeyen bir hata ile karşılaştık.";
}

import { z } from "zod";

export const passwordSchema = z
  .string("Lütfen şifrenizi giriniz.")
  .min(8, "Şifreniz en az 8 karakter olmalı.");

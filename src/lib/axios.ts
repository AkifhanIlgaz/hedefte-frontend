import axios from "axios";
import { createClient } from "./supabase/client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// ❗ Response Interceptor (Refresh’e gerek yok — Supabase kendi yapıyor)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const supabase = createClient();
    if (err.response?.status === 401) {
      supabase.auth.signOut();
    }
    return Promise.reject(err);
  },
);

export default api;

import { createClient } from "@/src/lib/supabase/client";

export const buildPaginationUrl = (
  baseUrl: string,
  params: { page: number; rowsPerPage: number; interval: number },
): string => {
  const { page, rowsPerPage, interval } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    rowsPerPage: rowsPerPage.toString(),
    interval: interval.toString(),
  });

  return `${baseUrl}?${queryParams.toString()}`;
};

export const fetcher = async (...args: [string, RequestInit?]) => {
  const supabase = createClient();

  const supabaseAccessToken = await supabase.auth
    .getSession()
    .then((res) => res.data.session?.access_token);

  if (!supabaseAccessToken) {
    throw new Error("Access token not found");
  }

  const [url, options] = args;
  const updatedOptions = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${supabaseAccessToken}`,
    },
  };

  return fetch(url, updatedOptions).then((res) => res.json());
};

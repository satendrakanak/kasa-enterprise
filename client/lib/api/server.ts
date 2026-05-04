import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
  url: string,
  method: Method,
  body?: unknown,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      cookie: cookieStore.toString(),
      ...(options.headers || {}),
    },
    ...(body
      ? body instanceof FormData
        ? { body }
        : { body: JSON.stringify(body) }
      : {}),
    ...options,
  });
  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const error = await response.json();

      if (Array.isArray(error.message)) {
        message = error.message.join(", ");
      } else if (typeof error.message === "string") {
        message = error.message;
      }
    } catch {}
    if (response.status === 401) {
      throw new Error("AUTH_EXPIRED");
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// 🔥 ALL METHODS IN SAME FILE

export const apiServer = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, "GET", undefined, options),

  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, "POST", body, options),

  patch: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, "PATCH", body, options),

  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, "DELETE", undefined, options),
};

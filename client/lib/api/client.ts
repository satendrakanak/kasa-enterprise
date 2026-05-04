type Method = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
  endpoint: string,
  method: Method,
  body?: unknown,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method,
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      ...(body
        ? {
            body: isFormData ? (body as FormData) : JSON.stringify(body),
          }
        : {}),
      ...options,
    });
  } catch (networkError) {
    console.error("NETWORK ERROR:", networkError);
    throw new Error("Network error. Please check your connection.");
  }

  // 🔴 Handle non-OK responses
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    let errorBody: any = null;

    try {
      errorBody = await response.json();

      if (Array.isArray(errorBody?.message)) {
        message = errorBody.message.join(", ");
      } else if (typeof errorBody?.message === "string") {
        message = errorBody.message;
      }
    } catch {
      // fallback
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  // 🟡 No content
  if (response.status === 204) {
    return {} as T;
  }

  // 🟢 Safe JSON parse
  try {
    const data = await response.json();
    return data as T;
  } catch (parseError) {
    console.error("JSON PARSE ERROR:", parseError);
    throw new Error("Invalid server response");
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, "GET", undefined, options),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, "POST", body, options),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, "PATCH", body, options),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, "DELETE", undefined, options),
};

export const withAuthRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unauthorized")
    ) {
      try {
        await apiClient.post("/api/auth/refresh-tokens");

        return await fn();
      } catch (refreshError) {
        throw refreshError;
      }
    }

    throw error;
  }
};

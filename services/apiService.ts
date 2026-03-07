import { supabase } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Erro estruturado — preserva status HTTP e code do backend
export class ApiError extends Error {
  status: number;
  code:   string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name   = "ApiError";
    this.status = status;
    this.code   = code;
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  method: string,
  body?: unknown
): Promise<T> {
  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(await getAuthHeader()),
  };

  const options: RequestInit = {
    method,
    headers,
    ...(body !== undefined && {
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    }),
  };

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    let code: string | undefined;
    try {
      const err = await response.json();
      if (err?.error) message = err.error;
      if (err?.code)  code    = err.code;
    } catch {}
    throw new ApiError(message, response.status, code);
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}

export const apiService = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint, "GET"),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, "POST", body),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, "PUT", body),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, "PATCH", body),

  delete: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, "DELETE", body),

  buildUrl: (endpoint: string) => `${API_URL}${endpoint}`,

  getraw: async (endpoint: string): Promise<Response> => {
    const headers = await getAuthHeader();
    return fetch(`${API_URL}${endpoint}`, { method: "GET", headers });
  },
};
/**
 * HTTP client for API communication.
 * Handles auth headers, error parsing, and base URL resolution.
 */
import { ApiError } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

class ApiClient {
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string>) },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "Unknown error");
      throw new ApiError(response.status, body);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

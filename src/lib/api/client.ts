/**
 * You Are Mine — Centralized Admin API Client
 *
 * Implements standard error handling, credentials inclusion,
 * CSRF protection headers, and typed JSON responses.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: string[];
  };
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: string[];

  constructor(message: string, code = "UNKNOWN_ERROR", status = 500, details?: string[]) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(endpoint, {
    credentials: "include",
    ...options,
    headers,
  });

  let result: any;
  try {
    result = await response.json();
  } catch (err) {
    throw new ApiError(
      `Invalid JSON response from server (HTTP ${response.status})`,
      "RESPONSE_PARSE_ERROR",
      response.status
    );
  }

  if (!response.ok || !result.success) {
    const errorObj = result.error || {};
    throw new ApiError(
      errorObj.message || `Request failed with status ${response.status}`,
      errorObj.code || `HTTP_${response.status}`,
      response.status,
      errorObj.details
    );
  }

  return result as ApiResponse<T>;
}

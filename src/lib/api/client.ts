/**
 * NEXALORA API Client
 * Production-ready fetch client connecting to https://nexalora-api.vercel.app
 * with automatic Bearer tokens, token refresh, and envelope unwrapping.
 */

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://nexalora-api.vercel.app';

export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    requestId?: string;
    [key: string]: any;
  };
}

export interface ApiError {
  code: string;
  message: string;
  requestId?: string;
  details?: any;
}

export class NexaloraApiException extends Error {
  code: string;
  status: number;
  requestId?: string;
  details?: any;

  constructor(status: number, error: ApiError) {
    super(error.message || `API request failed with status ${status}`);
    this.name = 'NexaloraApiException';
    this.status = status;
    this.code = error.code || 'UNKNOWN_ERROR';
    this.requestId = error.requestId;
    this.details = error.details;
  }
}

export interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
  skipAuth?: boolean;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken') || localStorage.getItem('nexalora_access_token');
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken') || localStorage.getItem('nexalora_refresh_token');
}

export function setStoredToken(accessToken: string | null, refreshToken?: string | null): void {
  if (typeof window === 'undefined') return;
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('nexalora_access_token', accessToken);
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('nexalora_access_token');
  }

  if (refreshToken !== undefined) {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('nexalora_refresh_token', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('nexalora_refresh_token');
    }
  }
}

export function clearStoredTokens(): void {
  setStoredToken(null, null);
}

/**
 * Standard fetcher un-wrapping { data } automatically as specified in API docs.
 */
export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { idempotencyKey, skipAuth, headers = {}, ...rest } = options;

  const accessToken = !skipAuth ? getStoredToken() : null;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (!skipAuth && accessToken) {
    requestHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  if (idempotencyKey) {
    requestHeaders['Idempotency-Key'] = idempotencyKey;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: requestHeaders,
      ...rest,
    });
  } catch (netErr) {
    throw new NexaloraApiException(0, {
      code: 'NETWORK_ERROR',
      message: netErr instanceof Error ? netErr.message : 'Koneksi jaringan terputus',
    });
  }

  // Jika token kedaluwarsa (401), coba refresh token otomatis
  if (res.status === 401 && !skipAuth && typeof window !== 'undefined') {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const newAccessToken = refreshJson?.data?.accessToken;
          const newRefreshToken = refreshJson?.data?.refreshToken;
          if (newAccessToken) {
            setStoredToken(newAccessToken, newRefreshToken);
            requestHeaders['Authorization'] = `Bearer ${newAccessToken}`;
            res = await fetch(`${BASE_URL}${endpoint}`, {
              headers: requestHeaders,
              ...rest,
            });
          }
        } else {
          clearStoredTokens();
        }
      } catch {
        clearStoredTokens();
      }
    }
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const errObj: ApiError = json?.error || {
      code: `HTTP_${res.status}`,
      message: `Permintaan gagal dengan status ${res.status}`,
      requestId: json?.meta?.requestId,
    };
    throw new NexaloraApiException(res.status, errObj);
  }

  return (json?.data !== undefined ? json.data : json) as T;
}

/**
 * Backward-compatible apiRequest returning full envelope { data, meta }
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const data = await apiFetch<T>(endpoint, options);
    return {
      data,
      meta: {
        requestId: `req_${Date.now()}`,
      },
    };
  } catch (error) {
    if (error instanceof NexaloraApiException) {
      throw error;
    }
    throw new NexaloraApiException(500, {
      code: 'UNEXPECTED_ERROR',
      message: error instanceof Error ? error.message : 'Terjadi kesalahan sistem',
    });
  }
}

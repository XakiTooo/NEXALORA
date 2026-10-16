// Demo build: backend access is deliberately unavailable. UI state is local.
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

  constructor(status: number, error: ApiError) {
    super(error.message || `API request failed with status ${status}`);
    this.name = 'NexaloraApiException';
    this.status = status;
    this.code = error.code || 'UNKNOWN_ERROR';
    this.requestId = error.requestId;
  }
}


export function getStoredToken(): null { return null; }
export function setStoredToken(_token: string | null): void {}
export async function apiRequest<T = unknown>(_endpoint: string, _options: RequestInit = {}): Promise<ApiResponse<T>> {
  throw new NexaloraApiException(503, { code: 'DEMO_LOCAL_ONLY', message: 'Versi demo menggunakan data lokal.' });
}

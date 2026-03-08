import type { ApiResponse } from './types';

/** Base URL for backend API. Browser uses rewrites (/api/backend -> backend). */
const API_BASE = '/api/backend';

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser: use direct backend URL if set (Network tab shows real API; CORS must allow it)
    const pub = process.env.NEXT_PUBLIC_API_URL;
    if (pub) return pub.replace(/\/$/, '');
    return ''; // else same-origin; next.config rewrites /api/backend/* -> backend
  }
  return (process.env.MATA_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8087').replace(/\/$/, '');
};

export function getApiPath(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  if (base === '') {
    // Rewrite maps /api/backend/:path -> backend /api/v1/:path
    const suffix = p.replace(/^\/api\/v1\/?/, '/') || '/';
    return `${API_BASE}${suffix}`;
  }
  return `${base}${p}`;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  const raw = await res.json().catch(() => ({}));
  return raw as ApiResponse<T>;
}

export interface RequestOptions extends RequestInit {
  token?: string | null;
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, skipAuth, ...init } = options;
  const url = path.startsWith('http') ? path : getApiPath(path);
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token && !skipAuth) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(url, { ...init, headers });
  const data = await parseJson<T>(res);
  if (!res.ok) {
    throw new ApiError(
      data?.message ?? res.statusText ?? 'Request failed',
      res.status,
      data
    );
  }
  return data;
}

/** Get JSON response data or throw. Use when you expect success and need only data. */
export async function apiData<T>(path: string, options?: RequestOptions): Promise<T | null> {
  const out = await apiRequest<T>(path, options);
  return out.data ?? null;
}

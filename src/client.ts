import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { GenesysAuth } from "./auth.js";
import type { GenesysConfig } from "./types.js";
import { REGION_BASE_URLS } from "./types.js";

// Extend Axios config to track retry state
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export class GenesysClient {
  private readonly http: AxiosInstance;
  private readonly auth: GenesysAuth;

  constructor(config: GenesysConfig) {
    this.auth = new GenesysAuth(config);

    this.http = axios.create({
      baseURL: `${REGION_BASE_URLS[config.region]}/api/v2`,
      headers: { "Content-Type": "application/json" },
    });

    // Attach bearer token to every request
    this.http.interceptors.request.use(async (req) => {
      req.headers.Authorization = `Bearer ${await this.auth.getAccessToken()}`;
      return req;
    });

    // On 401, clear cached token and retry once
    this.http.interceptors.response.use(undefined, async (error) => {
      const status = error.response?.status;
      const config = error.config as RetryableConfig | undefined;
      if (status === 401 && config && !config._retried) {
        this.auth.clearCache();
        config._retried = true;
        config.headers.Authorization = `Bearer ${await this.auth.getAccessToken()}`;
        return this.http.request(config);
      }
      return Promise.reject(normalizeError(error));
    });
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const config: AxiosRequestConfig = params ? { params } : {};
    const res = await this.http.get<T>(path, config);
    return res.data;
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await this.http.post<T>(path, body);
    return res.data;
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await this.http.patch<T>(path, body);
    return res.data;
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const res = await this.http.put<T>(path, body);
    return res.data;
  }

  async delete<T>(path: string): Promise<T> {
    const res = await this.http.delete<T>(path);
    return res.data;
  }
}

function normalizeError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.response?.data?.error_description ??
      error.message;
    const err = new Error(`Genesys API error ${status}: ${message}`);
    (err as NodeJS.ErrnoException).code = String(status);
    return err;
  }
  return error instanceof Error ? error : new Error(String(error));
}

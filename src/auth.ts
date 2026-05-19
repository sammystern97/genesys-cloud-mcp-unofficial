import axios from "axios";
import type { GenesysConfig, TokenResponse } from "./types.js";
import { REGION_AUTH_URLS } from "./types.js";

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

export class GenesysAuth {
  private cache: CachedToken | null = null;
  private readonly config: GenesysConfig;

  constructor(config: GenesysConfig) {
    this.config = config;
  }

  async getAccessToken(): Promise<string> {
    if (this.cache && Date.now() < this.cache.expiresAt) {
      return this.cache.accessToken;
    }
    return this.fetchToken();
  }

  private async fetchToken(): Promise<string> {
    const authUrl = REGION_AUTH_URLS[this.config.region];
    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString("base64");

    const response = await axios.post<TokenResponse>(
      `${authUrl}/oauth/token`,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = response.data;
    // Subtract 60s to refresh slightly before actual expiry
    this.cache = {
      accessToken: access_token,
      expiresAt: Date.now() + (expires_in - 60) * 1000,
    };

    return access_token;
  }

  clearCache(): void {
    this.cache = null;
  }
}

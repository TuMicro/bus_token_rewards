
export interface TwitterAccessTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // number of seconds until expiration
  lastTimeUpdated: number; // timestamp in millis
  scope: string[];
}

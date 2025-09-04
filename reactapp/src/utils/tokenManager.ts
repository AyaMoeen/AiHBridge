// src/utils/tokenManager.ts
export interface TokenData {
    accessToken: string;
    refreshToken: string;
    expiresAt?: number;
  }
  
  export interface DecodedToken {
    exp: number;
    iat: number;
    user_id: string;
    [key: string]: any;
  }
  
  class TokenManager {
    private readonly ACCESS_TOKEN_KEY = 'authToken';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';
  
    // Get access token from sessionStorage
    getAccessToken(): string | null {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
  
    // Get refresh token from sessionStorage
    getRefreshToken(): string | null {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
  
    // Set both tokens in sessionStorage
    setTokens(accessToken: string, refreshToken: string, expiresIn?: number): void {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      
      if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000);
        sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
      }
    }
  
    // Clear all auth tokens
    clearTokens(): void {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }
  
    // Check if user has valid tokens
    hasValidTokens(): boolean {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      return !!(accessToken && refreshToken);
    }
  
    // Check if access token is expired
    isAccessTokenExpired(): boolean {
      const expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiryTime) {
        // If no expiry time stored, assume token might be expired
        return true;
      }
      
      return Date.now() > parseInt(expiryTime);
    }
  
    // Decode JWT token (basic decode without verification)
    decodeToken(token: string): DecodedToken | null {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
  
    // Check if token will expire soon (within 5 minutes)
    isTokenExpiringSoon(token?: string): boolean {
      const accessToken = token || this.getAccessToken();
      if (!accessToken) return true;
  
      const decoded = this.decodeToken(accessToken);
      if (!decoded || !decoded.exp) return true;
  
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000); // 5 minutes in milliseconds
      
      return expirationTime < fiveMinutesFromNow;
    }
  
    // Get token expiry time
    getTokenExpiryTime(): Date | null {
      const accessToken = this.getAccessToken();
      if (!accessToken) return null;
  
      const decoded = this.decodeToken(accessToken);
      if (!decoded || !decoded.exp) return null;
  
      return new Date(decoded.exp * 1000);
    }
  
    // Get user ID from token
    getUserIdFromToken(): string | null {
      const accessToken = this.getAccessToken();
      if (!accessToken) return null;
  
      const decoded = this.decodeToken(accessToken);
      return decoded?.user_id || decoded?.sub || null;
    }
  
    // Check if tokens exist and are valid
    isAuthenticated(): boolean {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      
      if (!accessToken || !refreshToken) {
        return false;
      }
  
      // If access token is expired but we have refresh token, 
      // we're still considered authenticated (refresh will handle it)
      return true;
    }
  
    // Get authorization header
    getAuthHeader(): Record<string, string> | null {
      const token = this.getAccessToken();
      if (!token) return null;
      
      return {
        'Authorization': `Bearer ${token}`
      };
    }
  
    // Store token data as object
    setTokenData(tokenData: TokenData): void {
      this.setTokens(
        tokenData.accessToken, 
        tokenData.refreshToken, 
        tokenData.expiresAt ? (tokenData.expiresAt - Date.now()) / 1000 : undefined
      );
    }
  
    // Get all token data as object
    getTokenData(): TokenData | null {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      const expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
  
      if (!accessToken || !refreshToken) {
        return null;
      }
  
      return {
        accessToken,
        refreshToken,
        expiresAt: expiryTime ? parseInt(expiryTime) : undefined
      };
    }
  }
  
  // Export singleton instance
  export const tokenManager = new TokenManager();
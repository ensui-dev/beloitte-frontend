/**
 * Session token management.
 * Handles JWT storage in localStorage with type-safe accessors.
 *
 * The token lifecycle:
 *   1. Discord OAuth callback → backend returns JWT → stored here
 *   2. Every API request → api-client reads token from here
 *   3. Logout or expiry → token cleared
 */

const TOKEN_KEY = "beloitte_auth_token" as const;

/**
 * Persist the JWT token to localStorage.
 * Called after successful Discord OAuth callback.
 */
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieve the stored JWT token, or null if not present.
 * Called by api-client on every request and by AuthProvider on mount.
 */
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove the stored JWT token.
 * Called on explicit logout or when the backend returns 401.
 */
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check if a JWT token exists in storage.
 * Does NOT validate the token — that's the backend's job via /auth/me.
 */
export function hasStoredToken(): boolean {
  return getStoredToken() !== null;
}

/**
 * Discord OAuth2 helpers.
 *
 * The flow is backend-mediated:
 *   1. Frontend calls `redirectToDiscordLogin()`
 *   2. Browser navigates to `{API_URL}/auth/discord`
 *   3. Backend redirects to Discord's OAuth2 authorize URL
 *   4. User authenticates on Discord
 *   5. Discord redirects back to backend's callback endpoint
 *   6. Backend exchanges code, creates/finds user, generates JWT
 *   7. Backend redirects to `{FRONTEND_URL}/auth/callback?token={jwt}`
 *
 * This means the frontend NEVER handles Discord's client secret
 * or authorization codes directly — only the resulting JWT.
 */

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

/**
 * Redirect the browser to the backend's Discord OAuth endpoint.
 * The backend handles the full OAuth2 dance and redirects back
 * to /auth/callback with the JWT token.
 */
export function redirectToDiscordLogin(): void {
  window.location.href = `${API_URL}/auth/discord`;
}

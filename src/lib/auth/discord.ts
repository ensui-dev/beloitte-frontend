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
 *
 * The optional `intent` parameter (e.g. "business") is persisted to
 * localStorage before the redirect so it survives the OAuth round-trip.
 * The auth callback page reads it back via `consumeAuthIntent()`.
 */

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
const BANK_ID = import.meta.env.VITE_BANK_ID ?? "demo-bank-001";

/** localStorage key for persisting auth intent across the OAuth redirect. */
const INTENT_KEY = "beloitte:auth-intent";

/**
 * Redirect the browser to the backend's Discord OAuth endpoint.
 * The backend handles the full OAuth2 dance and redirects back
 * to /auth/callback with the JWT token.
 *
 * @param intent Optional intent to carry through the OAuth flow (e.g. "business").
 *               Stored in localStorage since the OAuth redirect leaves the SPA.
 */
export function redirectToDiscordLogin(intent?: string): void {
  if (intent) {
    localStorage.setItem(INTENT_KEY, intent);
  } else {
    localStorage.removeItem(INTENT_KEY);
  }
  window.location.href = `${API_URL}/auth/discord?bank_id=${encodeURIComponent(BANK_ID)}`;
}

/**
 * Read and clear the stored auth intent (one-time consume).
 * Returns null if no intent was stored.
 */
export function consumeAuthIntent(): string | null {
  const intent = localStorage.getItem(INTENT_KEY);
  localStorage.removeItem(INTENT_KEY);
  return intent;
}

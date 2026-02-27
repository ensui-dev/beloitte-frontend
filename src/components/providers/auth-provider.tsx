/**
 * Authentication provider — manages session state for the entire app.
 *
 * Auth state is modeled as a discriminated union:
 *   - "loading"          → checking stored token on mount
 *   - "authenticated"    → valid session with user data
 *   - "unauthenticated"  → no token or token was invalid
 *
 * On mount, if a token exists in localStorage, we validate it by
 * calling GET /auth/me. If it succeeds, we're authenticated.
 * If it fails (401, network error), we clear the token and go unauthenticated.
 *
 * Discord SSO is the ONLY authentication method. There is no
 * username/password, no magic links, no other OAuth providers.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, UserRole } from "@/lib/data/types";
import { apiClient } from "@/lib/data/api-client";
import { dataService } from "@/lib/data/data-service";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/auth/session";
import { canAccessRole } from "@/lib/auth/roles";

// ─── Auth State Types ───────────────────────────────────────

interface AuthLoading {
  readonly status: "loading";
}

interface AuthAuthenticated {
  readonly status: "authenticated";
  readonly session: Session;
}

interface AuthUnauthenticated {
  readonly status: "unauthenticated";
}

type AuthState = AuthLoading | AuthAuthenticated | AuthUnauthenticated;

// ─── Context Shape ──────────────────────────────────────────

interface AuthContextValue {
  readonly state: AuthState;
  /** Called after Discord OAuth callback with the JWT token. */
  readonly handleLoginToken: (token: string) => Promise<void>;
  /** Log out: clear token, invalidate session, reset state. */
  readonly logout: () => Promise<void>;
  /** Switch active role (player ↔ admin). Only works when authenticated. */
  readonly switchRole: (role: UserRole) => void;
  /** Re-fetch session from the server and update local state. */
  readonly refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Resolve the initial activeRole for a session.
 * Superadmins who only have "customer" assigned default to "admin" view
 * so they land on the admin dashboard after login.
 */
function resolveInitialSession(session: Session): Session {
  if (
    session.user.isSuperadmin &&
    !session.user.roles.includes("admin") &&
    session.activeRole === "customer"
  ) {
    return { ...session, activeRole: "admin" };
  }
  return session;
}

// ─── Provider ───────────────────────────────────────────────

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  // On mount, check for an existing token and validate it
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setState({ status: "unauthenticated" });
      return;
    }

    // Set the token on the API client so /auth/me can use it
    apiClient.setToken(token);

    dataService
      .getSession()
      .then((session) => {
        setState({ status: "authenticated", session: resolveInitialSession(session) });
      })
      .catch(() => {
        // Token was invalid or expired — clean up
        clearStoredToken();
        apiClient.clearToken();
        setState({ status: "unauthenticated" });
      });
  }, []);

  const handleLoginToken = useCallback(async (token: string): Promise<void> => {
    setStoredToken(token);
    apiClient.setToken(token);

    try {
      const session = await dataService.getSession();
      setState({ status: "authenticated", session: resolveInitialSession(session) });
    } catch {
      clearStoredToken();
      apiClient.clearToken();
      setState({ status: "unauthenticated" });
      throw new Error("Failed to validate session after login");
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await dataService.logout();
    } finally {
      // Always clear local state, even if the API call fails
      clearStoredToken();
      apiClient.clearToken();
      setState({ status: "unauthenticated" });
    }
  }, []);

  const switchRole = useCallback((role: UserRole): void => {
    setState((prev) => {
      if (prev.status !== "authenticated") return prev;

      // Allow switching to assigned roles or any role for superadmins
      const { roles, isSuperadmin } = prev.session.user;
      if (!canAccessRole(role, roles, isSuperadmin)) return prev;

      return {
        status: "authenticated",
        session: { ...prev.session, activeRole: role },
      };
    });
  }, []);

  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const session = await dataService.getSession();
      setState({ status: "authenticated", session: resolveInitialSession(session) });
    } catch {
      // If refresh fails, don't disrupt the current state
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ state, handleLoginToken, logout, switchRole, refreshSession }),
    [state, handleLoginToken, logout, switchRole, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hooks ──────────────────────────────────────────────────

/**
 * Access the full auth context. Throws if used outside AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

/**
 * Get the current session, or null if not authenticated.
 * Convenience hook that avoids forcing consumers to discriminate the union.
 */
export function useSession(): Session | null {
  const { state } = useAuth();
  return state.status === "authenticated" ? state.session : null;
}

/**
 * Get the current active role, or null if not authenticated.
 */
export function useActiveRole(): UserRole | null {
  const session = useSession();
  return session?.activeRole ?? null;
}

/**
 * Check if the current user has admin privileges.
 */
export function useIsAdmin(): boolean {
  const session = useSession();
  return (session?.user.roles.includes("admin") || session?.user.isSuperadmin) ?? false;
}

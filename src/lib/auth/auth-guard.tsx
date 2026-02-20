/**
 * Route guard that protects authenticated areas.
 *
 * Usage in the router:
 *   <Route element={<AuthGuard />}>
 *     <Route path="dashboard" element={<Dashboard />} />
 *   </Route>
 *
 * Optionally restrict to a specific role:
 *   <Route element={<AuthGuard requiredRole="admin" />}>
 *     <Route path="admin" element={<AdminPanel />} />
 *   </Route>
 *
 * Behavior:
 *   - "loading" → shows skeleton
 *   - "unauthenticated" → redirects to /login
 *   - "authenticated" but wrong role → redirects to /dashboard
 *   - "authenticated" with correct role → renders child routes via <Outlet />
 */
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/components/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/lib/data/types";

interface AuthGuardProps {
  /** If specified, the user must have this role active to access the route. */
  readonly requiredRole?: UserRole;
}

export function AuthGuard({ requiredRole }: AuthGuardProps): React.ReactElement {
  const { state } = useAuth();
  const location = useLocation();

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (state.status === "unauthenticated") {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // At this point, state.status === "authenticated"
  if (requiredRole && state.session.activeRole !== requiredRole) {
    // User is authenticated but doesn't have the required role active.
    // Redirect to the default dashboard instead of showing a 403.
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

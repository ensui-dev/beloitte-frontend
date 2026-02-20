import { Routes, Route } from "react-router";
import { LandingPage } from "@/routes/landing";
import { LoginPage } from "@/routes/login";
import { AuthCallbackPage } from "@/routes/auth-callback";
import { AuthGuard } from "@/lib/auth/auth-guard";

export function App(): React.ReactElement {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Protected routes — requires authentication */}
      <Route element={<AuthGuard />}>
        {/* Dashboard routes - TODO Phase 6+ */}
        {/* <Route path="/dashboard" element={<DashboardLayout />}> */}
        {/*   <Route index element={<Navigate to="player" replace />} /> */}
        {/*   <Route path="player" element={<PlayerOverview />} /> */}
        {/*   <Route path="player/transactions" element={<Transactions />} /> */}
        {/*   <Route path="player/transfers" element={<Transfers />} /> */}
        {/* </Route> */}
      </Route>

      {/* Admin-only routes — requires admin role */}
      <Route element={<AuthGuard requiredRole="admin" />}>
        {/* <Route path="/dashboard/admin" element={<AdminLayout />}> */}
        {/*   <Route index element={<AdminOverview />} /> */}
        {/*   <Route path="site-editor" element={<SiteEditor />} /> */}
        {/*   <Route path="theme" element={<ThemeEditor />} /> */}
        {/*   <Route path="settings" element={<Settings />} /> */}
        {/* </Route> */}
      </Route>
    </Routes>
  );
}

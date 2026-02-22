import { Routes, Route, Navigate } from "react-router";
import { LandingPage } from "@/routes/landing";
import { LoginPage } from "@/routes/login";
import { AuthCallbackPage } from "@/routes/auth-callback";
import { AuthGuard } from "@/lib/auth/auth-guard";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardOverview } from "@/routes/dashboard/overview";
import { DashboardTransactions } from "@/routes/dashboard/transactions";
import { DashboardTransfers } from "@/routes/dashboard/transfers";
import { DashboardWithdrawals } from "@/routes/dashboard/withdrawals";
import { OnboardingPage } from "@/routes/onboarding";
import { NewAccountPage } from "@/routes/dashboard/new-account";
import { AdminOverview } from "@/routes/dashboard/admin/overview";
import { AdminSiteEditor } from "@/routes/dashboard/admin/site-editor";
import { AdminTheme } from "@/routes/dashboard/admin/theme";
import { AdminSettings } from "@/routes/dashboard/admin/settings";

export function App(): React.ReactElement {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Onboarding — requires auth but NOT inside dashboard layout */}
      <Route element={<AuthGuard />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>

      {/* Dashboard — requires authentication */}
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="transactions" element={<DashboardTransactions />} />
          <Route path="transfers" element={<DashboardTransfers />} />
          <Route path="withdrawals" element={<DashboardWithdrawals />} />
          <Route path="accounts/new" element={<NewAccountPage />} />

          {/* Admin routes — requires admin role */}
          <Route element={<AuthGuard requiredRole="admin" />}>
            <Route path="admin" element={<AdminOverview />} />
            <Route path="admin/site-editor" element={<AdminSiteEditor />} />
            <Route path="admin/theme" element={<AdminTheme />} />
            <Route path="admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

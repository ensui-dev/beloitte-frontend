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
import { AdminUsers } from "@/routes/dashboard/admin/users";
import { TellerDashboard } from "@/routes/dashboard/teller/dashboard";
import { TellerAccountLookup } from "@/routes/dashboard/teller/lookup";
import { TellerProcessDeposit } from "@/routes/dashboard/teller/deposit";
import { TellerProcessWithdrawal } from "@/routes/dashboard/teller/withdrawal";
import { TellerAccountManagement } from "@/routes/dashboard/teller/accounts";
import { TellerTransactionLog } from "@/routes/dashboard/teller/transactions";
import { AccountantDashboard } from "@/routes/dashboard/accountant/dashboard";
import { AccountantAllAccounts } from "@/routes/dashboard/accountant/accounts";
import { AccountantTransactionHistory } from "@/routes/dashboard/accountant/transactions";
import { AccountantActivityLog } from "@/routes/dashboard/accountant/activity";
import { AccountantSystemHealth } from "@/routes/dashboard/accountant/health";

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

          {/* Teller routes — requires teller role */}
          <Route element={<AuthGuard requiredRole="teller" />}>
            <Route path="teller" element={<TellerDashboard />} />
            <Route path="teller/lookup" element={<TellerAccountLookup />} />
            <Route path="teller/deposit" element={<TellerProcessDeposit />} />
            <Route path="teller/withdrawal" element={<TellerProcessWithdrawal />} />
            <Route path="teller/accounts" element={<TellerAccountManagement />} />
            <Route path="teller/transactions" element={<TellerTransactionLog />} />
          </Route>

          {/* Accountant routes — requires accountant role */}
          <Route element={<AuthGuard requiredRole="accountant" />}>
            <Route path="accountant" element={<AccountantDashboard />} />
            <Route path="accountant/accounts" element={<AccountantAllAccounts />} />
            <Route path="accountant/transactions" element={<AccountantTransactionHistory />} />
            <Route path="accountant/activity" element={<AccountantActivityLog />} />
            <Route path="accountant/health" element={<AccountantSystemHealth />} />
          </Route>

          {/* Admin routes — requires admin role */}
          <Route element={<AuthGuard requiredRole="admin" />}>
            <Route path="admin" element={<AdminOverview />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/site-editor" element={<AdminSiteEditor />} />
            <Route path="admin/theme" element={<AdminTheme />} />
            <Route path="admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

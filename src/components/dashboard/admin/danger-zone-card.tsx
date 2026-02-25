import { RotateCcw, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { siteConfig as defaultSiteConfig } from "@/lib/data/mock-data";
import { dataService } from "@/lib/data/data-service";
import { useQueryClient } from "@tanstack/react-query";

const BANK_ID = import.meta.env.VITE_BANK_ID ?? "demo-bank-001";

function isMockMode(): boolean {
  return import.meta.env.VITE_MOCK_MODE === "true";
}

export function DangerZoneCard(): React.ReactElement {
  const queryClient = useQueryClient();

  async function handleResetConfig(): Promise<void> {
    try {
      await dataService.updateSiteConfig(BANK_ID, defaultSiteConfig);
      queryClient.setQueryData(["siteConfig", BANK_ID], defaultSiteConfig);
      toast.success("Site config reset to defaults");
    } catch {
      toast.error("Failed to reset site config");
    }
  }

  function handleClearMockData(): void {
    try {
      localStorage.removeItem("beloitte:mock-site-config");
      localStorage.removeItem("beloitte:mock-accounts");
      localStorage.removeItem("beloitte:mock-version");
      localStorage.removeItem("beloitte:auth-intent");
      localStorage.removeItem("beloitte_auth_token");
      toast.success("Mock data cleared. Reloading...");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      toast.error("Failed to clear mock data");
    }
  }

  return (
    <Card className="border-destructive/30 bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reset Site Config */}
        <div className="flex items-center justify-between rounded-md border border-white/[0.06] px-4 py-3">
          <div>
            <p className="text-sm font-medium">Reset Site Configuration</p>
            <p className="text-xs text-muted-foreground">
              Revert all site settings (theme, nav, modules) to factory defaults.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset site configuration?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will revert all site settings — theme, navigation, branding,
                  and landing page modules — to their factory defaults. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetConfig}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Reset Configuration
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Clear Mock Data (mock mode only) */}
        {isMockMode() && (
          <div className="flex items-center justify-between rounded-md border border-white/[0.06] px-4 py-3">
            <div>
              <p className="text-sm font-medium">Clear Mock Data</p>
              <p className="text-xs text-muted-foreground">
                Remove all localStorage mock state (accounts, config) and reload.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all mock data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all mock accounts, site config overrides, and
                    auth state from localStorage. The page will reload with a fresh
                    state. You will need to log in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearMockData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear & Reload
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

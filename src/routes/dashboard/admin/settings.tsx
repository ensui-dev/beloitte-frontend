import { Save, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig, useUpdateSiteConfig } from "@/hooks/use-site-config";
import { useBank } from "@/hooks/use-bank";
import { useSettingsEditorState } from "@/hooks/use-settings-editor-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BankIdentityCard } from "@/components/dashboard/admin/bank-identity-card";
import { CurrencyConfigCard } from "@/components/dashboard/admin/currency-config-card";
import { NavConfigCard } from "@/components/dashboard/admin/nav-config-card";
import { DangerZoneCard } from "@/components/dashboard/admin/danger-zone-card";

export function AdminSettings(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const { data: bank } = useBank();
  const updateConfig = useUpdateSiteConfig();

  usePageTitle("Settings", config?.bankName);

  if (!config) {
    return <SettingsSkeleton />;
  }

  return <SettingsContent config={config} bank={bank} updateConfig={updateConfig} />;
}

// ─── Inner component that can use the settings editor hook ──────

function SettingsContent({
  config,
  bank,
  updateConfig,
}: {
  readonly config: NonNullable<ReturnType<typeof useSiteConfig>["data"]>;
  readonly bank: ReturnType<typeof useBank>["data"];
  readonly updateConfig: ReturnType<typeof useUpdateSiteConfig>;
}): React.ReactElement {
  const editor = useSettingsEditorState(config);

  async function handleSave(): Promise<void> {
    try {
      await updateConfig.mutateAsync(editor.getDraftConfig());
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bank configuration and preferences.
          </p>
        </div>

        {/* Save bar */}
        {editor.hasUnsavedChanges && (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={editor.discardChanges}
              className="gap-1.5"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateConfig.isPending}
              className="gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {updateConfig.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Bank Identity */}
      <BankIdentityCard
        bank={bank}
        bankName={editor.draft.bankName}
        bankSlug={editor.draft.bankSlug}
        onBankNameChange={editor.updateBankName}
        onBankSlugChange={editor.updateBankSlug}
      />

      {/* Currency */}
      <CurrencyConfigCard
        currency={editor.draft.currency}
        onUpdate={editor.updateCurrency}
      />

      {/* Navigation */}
      <NavConfigCard
        nav={editor.draft.nav}
        onUpdate={editor.updateNav}
        onAddLink={editor.addNavLink}
        onRemoveLink={editor.removeNavLink}
        onUpdateLink={editor.updateNavLink}
      />

      {/* Danger Zone */}
      <DangerZoneCard />
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────

function SettingsSkeleton(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-xl" />
      ))}
    </div>
  );
}

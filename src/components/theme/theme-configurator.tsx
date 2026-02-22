/**
 * ThemeConfigurator — the main theme editor orchestrator.
 *
 * Tabbed layout: Presets | Colors | Typography | Radius | Branding
 * Header with save/discard buttons matching the site editor pattern.
 * All changes preview live via useThemeEditorState's DOM injection.
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { Undo2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateSiteConfig } from "@/hooks/use-site-config";
import { useThemeEditorState } from "@/hooks/use-theme-editor-state";
import { PresetSelector } from "./preset-selector";
import { AccentHueSlider } from "./accent-hue-slider";
import { ColorsPanel } from "./advanced-colors-panel";
import { FontSelector } from "./font-selector";
import { BorderRadiusSlider } from "./border-radius-slider";
import { BrandingPanel } from "./branding-panel";
import type { SiteConfig } from "@/lib/config/site-config-schema";

interface ThemeConfiguratorProps {
  readonly config: SiteConfig;
}

export function ThemeConfigurator({
  config,
}: ThemeConfiguratorProps): React.ReactElement {
  const editor = useThemeEditorState(config);
  const updateConfig = useUpdateSiteConfig();

  const handleSave = useCallback((): void => {
    const draftConfig = editor.getDraftConfig();
    updateConfig.mutate(draftConfig, {
      onSuccess: () => {
        toast.success("Theme saved successfully");
      },
      onError: (error) => {
        toast.error(`Failed to save: ${error.message}`);
      },
    });
  }, [editor, updateConfig]);

  const handleDiscard = useCallback((): void => {
    editor.discardChanges();
    toast.info("Theme changes discarded");
  }, [editor]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Theme</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure colors, fonts, and branding. Changes preview live.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editor.hasUnsavedChanges && (
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="gap-2"
            >
              <Undo2 className="h-4 w-4" />
              Discard
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!editor.hasUnsavedChanges || updateConfig.isPending}
            className="gap-2"
          >
            {updateConfig.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="presets" className="w-full">
        <TabsList>
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="radius">Radius</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        {/* ─── Presets Tab ─────────────────────────────────── */}
        <TabsContent value="presets" className="space-y-6 pt-2">
          <PresetSelector
            activePresetId={editor.draft.theme.preset}
            onSelect={editor.applyPreset}
          />
        </TabsContent>

        {/* ─── Colors Tab ──────────────────────────────────── */}
        <TabsContent value="colors" className="space-y-5 pt-2">
          <AccentHueSlider
            hue={editor.accentHue}
            onChange={editor.setAccentHue}
            mode={editor.draft.theme.mode}
          />

          <ColorsPanel
            colors={editor.draft.theme.colors}
            onColorChange={editor.updateColor}
          />
        </TabsContent>

        {/* ─── Typography Tab ──────────────────────────────── */}
        <TabsContent value="typography" className="pt-2">
          <FontSelector
            headingFont={editor.draft.theme.fonts.heading}
            bodyFont={editor.draft.theme.fonts.body}
            onHeadingChange={(f) => editor.updateFont("heading", f)}
            onBodyChange={(f) => editor.updateFont("body", f)}
          />
        </TabsContent>

        {/* ─── Radius Tab ──────────────────────────────────── */}
        <TabsContent value="radius" className="pt-2">
          <BorderRadiusSlider
            value={editor.draft.theme.borderRadius}
            onChange={editor.updateBorderRadius}
          />
        </TabsContent>

        {/* ─── Branding Tab ────────────────────────────────── */}
        <TabsContent value="branding" className="pt-2">
          <BrandingPanel
            branding={editor.draft.branding}
            onChange={editor.updateBranding}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

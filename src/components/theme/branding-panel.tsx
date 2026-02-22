/**
 * Branding panel — logo/favicon URL inputs + social icon toggles.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  SOCIAL_PLATFORMS,
  type Branding,
  type SocialPlatform,
} from "@/lib/config/site-config-schema";

interface BrandingPanelProps {
  readonly branding: Branding;
  readonly onChange: (patch: Partial<Branding>) => void;
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  discord: "Discord",
  twitter: "Twitter / X",
  youtube: "YouTube",
  github: "GitHub",
  instagram: "Instagram",
};

export function BrandingPanel({
  branding,
  onChange,
}: BrandingPanelProps): React.ReactElement {
  const toggleSocialIcon = (platform: SocialPlatform, enabled: boolean): void => {
    const current = branding.socialIcons ?? [];
    const next = enabled
      ? [...current, platform]
      : current.filter((p) => p !== platform);
    onChange({ socialIcons: next });
  };

  return (
    <div className="space-y-6">
      {/* Logo URL */}
      <div className="space-y-2">
        <Label className="text-sm">Logo URL</Label>
        <Input
          value={branding.logoUrl ?? ""}
          onChange={(e) => onChange({ logoUrl: e.target.value || undefined })}
          placeholder="https://example.com/logo.svg"
          className="font-mono text-xs"
        />
        {branding.logoUrl && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-2">
            <img
              src={branding.logoUrl}
              alt="Logo preview"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-xs text-muted-foreground">Preview</span>
          </div>
        )}
      </div>

      {/* Favicon URL */}
      <div className="space-y-2">
        <Label className="text-sm">Favicon URL</Label>
        <Input
          value={branding.faviconUrl ?? ""}
          onChange={(e) => onChange({ faviconUrl: e.target.value || undefined })}
          placeholder="https://example.com/favicon.ico"
          className="font-mono text-xs"
        />
        {branding.faviconUrl && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-2">
            <img
              src={branding.faviconUrl}
              alt="Favicon preview"
              className="size-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-xs text-muted-foreground">Preview</span>
          </div>
        )}
      </div>

      {/* Social icon toggles */}
      <div className="space-y-2">
        <Label className="text-sm">Social Icons</Label>
        <p className="text-xs text-muted-foreground">
          Choose which social platforms to show on the landing page.
        </p>
        <div className="space-y-2 pt-1">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div
              key={platform}
              className="flex items-center justify-between rounded-md px-2 py-1.5"
            >
              <span className="text-sm">{PLATFORM_LABELS[platform]}</span>
              <Switch
                checked={branding.socialIcons?.includes(platform) ?? false}
                onCheckedChange={(checked) =>
                  toggleSocialIcon(platform, checked)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

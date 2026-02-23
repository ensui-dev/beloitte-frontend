import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { NavConfig } from "@/lib/config/site-config-schema";

interface NavConfigCardProps {
  readonly nav: NavConfig;
  readonly onUpdate: (patch: Partial<NavConfig>) => void;
  readonly onAddLink: (link: { label: string; href: string }) => void;
  readonly onRemoveLink: (index: number) => void;
  readonly onUpdateLink: (index: number, link: { label: string; href: string }) => void;
}

export function NavConfigCard({
  nav,
  onUpdate,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
}: NavConfigCardProps): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">Navigation</CardTitle>
        <CardDescription>Configure the public navigation bar and CTA buttons.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nav Links */}
        <div className="space-y-3">
          <Label>Navigation Links</Label>
          {nav.links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No navigation links configured.</p>
          ) : (
            <div className="space-y-2">
              {nav.links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={link.label}
                    onChange={(e) =>
                      onUpdateLink(index, { ...link, label: e.target.value })
                    }
                    placeholder="Label"
                    className="flex-1"
                  />
                  <Input
                    value={link.href}
                    onChange={(e) =>
                      onUpdateLink(index, { ...link, href: e.target.value })
                    }
                    placeholder="URL or path"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveLink(index)}
                    aria-label={`Remove ${link.label} link`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLink({ label: "", href: "" })}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Link
          </Button>
        </div>

        {/* CTA Config */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cta-text">CTA Text</Label>
            <Input
              id="cta-text"
              value={nav.ctaText}
              onChange={(e) => onUpdate({ ctaText: e.target.value })}
              placeholder="e.g. Sign up"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-link">CTA Link</Label>
            <Input
              id="cta-link"
              value={nav.ctaLink}
              onChange={(e) => onUpdate({ ctaLink: e.target.value })}
              placeholder="e.g. /login"
            />
          </div>
        </div>

        {/* Show Login Toggle */}
        <div className="flex items-center justify-between rounded-md border border-white/[0.06] px-4 py-3">
          <div>
            <Label htmlFor="show-login" className="cursor-pointer">Show Login Button</Label>
            <p className="text-xs text-muted-foreground">
              Display "Log in" and CTA in the navigation bar.
            </p>
          </div>
          <Switch
            id="show-login"
            checked={nav.showLogin}
            onCheckedChange={(checked) => onUpdate({ showLogin: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

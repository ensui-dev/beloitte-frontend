import { Separator } from "@/components/ui/separator";
import type { FooterConfig } from "@/lib/config/site-config-schema";

interface FooterSectionProps {
  readonly config: FooterConfig;
}

export function FooterSection({
  config,
}: FooterSectionProps): React.ReactElement {
  const year = config.copyrightYear ?? new Date().getFullYear().toString();

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <div className="text-lg font-bold">{config.brandName}</div>
            {config.tagline && (
              <div className="mt-1 text-sm text-muted-foreground">
                {config.tagline}
              </div>
            )}
          </div>

          {config.links.length > 0 && (
            <nav className="flex gap-6">
              {config.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        <Separator className="my-8 bg-white/[0.06]" />

        <div className="text-center text-xs text-muted-foreground">
          &copy; {year} {config.brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

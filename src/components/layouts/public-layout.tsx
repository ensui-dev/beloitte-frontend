import type { ReactNode } from "react";
import type { SiteConfig } from "@/lib/config/site-config-schema";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

interface PublicLayoutProps {
  children: ReactNode;
  config?: SiteConfig;
}

export function PublicLayout({ children, config }: PublicLayoutProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient gradient mesh — gives glass surfaces depth */}
      <div className="ambient-mesh" />

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo config={config} />

          <div className="flex items-center gap-4">
            {config?.nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}

            {config?.nav.showLogin !== false && (
              <Button asChild size="sm">
                <a href={config?.nav.ctaLink ?? "/login"}>
                  {config?.nav.ctaText ?? "Get Started"}
                </a>
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}

import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import type { SiteConfig } from "@/lib/config/site-config-schema";
import { useSession, useAuth } from "@/components/providers/auth-provider";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

/** Internal links (starting with /) use React Router Link for SPA navigation. */
function NavLink({ href, className, children, onClick }: {
  readonly href: string;
  readonly className?: string;
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
}): React.ReactElement {
  if (href.startsWith("/")) {
    return <Link to={href} className={className} onClick={onClick}>{children}</Link>;
  }
  return <a href={href} className={className} onClick={onClick}>{children}</a>;
}

interface PublicLayoutProps {
  children: ReactNode;
  config?: SiteConfig;
}

export function PublicLayout({ children, config }: PublicLayoutProps): React.ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = (): void => setMobileMenuOpen(false);
  const session = useSession();
  const { logout } = useAuth();
  const isAuthenticated = session !== null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient gradient mesh — gives glass surfaces depth */}
      <div className="ambient-mesh" />

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo config={config} />

          {/* Desktop navigation */}
          <div className="hidden items-center gap-4 md:flex">
            {config?.nav.links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </NavLink>
            ))}

            {config?.nav.showLogin !== false && (
              isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Sign out
                  </button>
                  <Button asChild size="sm">
                    <NavLink href="/dashboard">Dashboard</NavLink>
                  </Button>
                </>
              ) : (
                <>
                  <NavLink
                    href="/login"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Log in
                  </NavLink>
                  <Button asChild size="sm">
                    <NavLink href={config?.nav.ctaLink ?? "/login"}>
                      {config?.nav.ctaText ?? "Sign up"}
                    </NavLink>
                  </Button>
                </>
              )
            )}
          </div>

          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-white/[0.06] bg-background/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Logo config={config} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 pt-6">
                {config?.nav.links.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {config?.nav.showLogin !== false && (
                  isAuthenticated ? (
                    <>
                      <button
                        type="button"
                        onClick={() => { void logout(); closeMobileMenu(); }}
                        className="rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        Sign out
                      </button>
                      <div className="pt-3">
                        <Button asChild className="w-full">
                          <NavLink href="/dashboard" onClick={closeMobileMenu}>
                            Dashboard
                          </NavLink>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <NavLink
                        href="/login"
                        className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        onClick={closeMobileMenu}
                      >
                        Log in
                      </NavLink>
                      <div className="pt-3">
                        <Button asChild className="w-full">
                          <NavLink href={config?.nav.ctaLink ?? "/login"} onClick={closeMobileMenu}>
                            {config?.nav.ctaText ?? "Sign up"}
                          </NavLink>
                        </Button>
                      </div>
                    </>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}

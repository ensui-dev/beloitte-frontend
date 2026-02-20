import type { SiteConfig } from "@/lib/config/site-config-schema";

interface LogoProps {
  config?: SiteConfig;
  className?: string;
}

export function Logo({ config, className }: LogoProps): React.ReactElement {
  const bankName = config?.bankName ?? "Bank";
  const logoUrl = config?.branding.logoUrl;

  if (logoUrl) {
    return (
      <a href="/" className={className}>
        <img
          src={logoUrl}
          alt={`${bankName} logo`}
          className="h-8 w-auto"
        />
      </a>
    );
  }

  return (
    <a
      href="/"
      className={`text-xl font-bold tracking-tight text-foreground ${className ?? ""}`}
    >
      {bankName}
    </a>
  );
}

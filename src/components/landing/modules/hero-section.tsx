import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ImageIcon } from "lucide-react";
import type { HeroConfig } from "@/lib/config/site-config-schema";

/** Use React Router Link for internal hrefs, plain <a> for external/anchor links. */
function HeroLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }): React.ReactElement {
  if (href.startsWith("/")) {
    return <Link to={href} {...props}>{children}</Link>;
  }
  return <a href={href} {...props}>{children}</a>;
}

interface HeroSectionProps {
  readonly config: HeroConfig;
}

/**
 * Gradient variant — bold primary-colored radial glow with a vertical fade.
 * More dramatic than a plain dark background.
 */
function GradientBackground(): React.ReactElement {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-primary/[0.02] to-transparent" />
      <div className="absolute top-[-20%] left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-[120px]" />
      <div className="absolute top-[10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[100px]" />
    </div>
  );
}

/**
 * Image variant — full-bleed background image with a dark gradient overlay.
 * Falls back to a placeholder state when no image URL is provided.
 */
function ImageBackground({
  src,
}: {
  readonly src: string | undefined;
}): React.ReactElement {
  if (!src) {
    return (
      <div className="absolute inset-0 z-0">
        {/* Placeholder pattern when no image URL is set */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-primary/[0.04]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <ImageIcon className="h-48 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
    </div>
  );
}

/**
 * Particles variant — CSS-only animated floating dots.
 * Uses radial-gradient dots with upward float animation plus larger accent orbs.
 */
function ParticlesBackground(): React.ReactElement {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Soft ambient glow behind content */}
      <div className="absolute top-[10%] left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />

      {/* Particle field — the animated dots */}
      <div className="hero-particles absolute inset-0" />
    </div>
  );
}

/**
 * Resolves the correct background based on the config variant.
 */
function HeroBackground({
  config,
}: {
  readonly config: HeroConfig;
}): React.ReactElement {
  switch (config.backgroundVariant) {
    case "image":
      return <ImageBackground src={config.backgroundImage} />;
    case "particles":
      return <ParticlesBackground />;
    case "gradient":
    default:
      return <GradientBackground />;
  }
}

export function HeroSection({ config }: HeroSectionProps): React.ReactElement {
  const isCenter = config.alignment === "center";

  return (
    <div className="relative isolate overflow-hidden">
      <HeroBackground config={config} />

      <div
        className={`relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-20 pt-24 md:pt-32 ${
          isCenter ? "items-center text-center" : "items-start"
        }`}
      >
        <div className={`max-w-3xl space-y-6 ${isCenter ? "" : "md:max-w-2xl"}`}>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            {config.headline}
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            {config.subheadline}
          </p>
          <div className={`flex flex-wrap gap-3 pt-2 ${isCenter ? "justify-center" : ""}`}>
            <Button size="lg" asChild>
              <HeroLink href={config.ctaLink}>{config.ctaText}</HeroLink>
            </Button>
            {config.secondaryCtaText && config.secondaryCtaLink && (
              <Button size="lg" variant="outline" asChild className="group border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
                <HeroLink href={config.secondaryCtaLink}>
                  {config.secondaryCtaText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </HeroLink>
              </Button>
            )}
          </div>
        </div>

        {config.showDashboardPreview && (
          <div className="w-full max-w-5xl pt-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-2xl shadow-primary/[0.08] backdrop-blur-xl backdrop-saturate-150">
              {/* Mock dashboard preview */}
              <div className="aspect-[16/9] w-full p-6">
                <div className="flex h-full flex-col gap-4">
                  {/* Top bar mock */}
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 rounded-full bg-white/[0.06]" />
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/[0.06]" />
                      <div className="h-8 w-20 rounded-md bg-primary/[0.15]" />
                    </div>
                  </div>
                  {/* Stats row mock */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm"
                      >
                        <div className="h-2 w-16 rounded bg-white/[0.08]" />
                        <div className="mt-2 h-6 w-24 rounded bg-white/[0.05]" />
                      </div>
                    ))}
                  </div>
                  {/* Chart mock */}
                  <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex h-full items-end gap-2">
                      {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 90, 65].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-primary/[0.25]"
                            style={{ height: `${h}%` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

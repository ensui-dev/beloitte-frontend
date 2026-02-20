import { Button } from "@/components/ui/button";
import type { HeroConfig } from "@/lib/config/site-config-schema";

interface HeroSectionProps {
  readonly config: HeroConfig;
}

export function HeroSection({ config }: HeroSectionProps): React.ReactElement {
  const isCenter = config.alignment === "center";

  return (
    <div className="relative overflow-hidden">
      {/* Atmospheric gradient — two soft blobs that give the hero depth */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute top-[-20%] left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
      </div>

      <div
        className={`mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-20 pt-24 md:pt-32 ${
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
          <div className={`flex gap-4 pt-2 ${isCenter ? "justify-center" : ""}`}>
            <Button size="lg" asChild>
              <a href={config.ctaLink}>{config.ctaText}</a>
            </Button>
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

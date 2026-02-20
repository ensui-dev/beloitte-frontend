import { Button } from "@/components/ui/button";
import type { CtaConfig } from "@/lib/config/site-config-schema";

interface CtaSectionProps {
  readonly config: CtaConfig;
}

export function CtaSection({ config }: CtaSectionProps): React.ReactElement {
  if (config.variant === "fullwidth") {
    return (
      <div className="bg-primary/[0.03] py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {config.heading}
          </h2>
          {config.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {config.description}
            </p>
          )}
          <div className="mt-8">
            <Button size="lg" asChild>
              <a href={config.buttonLink}>{config.buttonText}</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (config.variant === "card") {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-12 text-center backdrop-blur-xl backdrop-saturate-150">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {config.heading}
          </h2>
          {config.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {config.description}
            </p>
          )}
          <div className="mt-8">
            <Button size="lg" asChild>
              <a href={config.buttonLink}>{config.buttonText}</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default: banner
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {config.heading}
          </h2>
          {config.description && (
            <p className="mt-2 text-muted-foreground">{config.description}</p>
          )}
        </div>
        <Button size="lg" asChild className="shrink-0">
          <a href={config.buttonLink}>{config.buttonText}</a>
        </Button>
      </div>
    </div>
  );
}

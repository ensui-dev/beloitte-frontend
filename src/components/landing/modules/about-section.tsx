import type { AboutConfig } from "@/lib/config/site-config-schema";

interface AboutSectionProps {
  readonly config: AboutConfig;
}

export function AboutSection({
  config,
}: AboutSectionProps): React.ReactElement {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {config.heading}
          </h2>
          {config.body && (
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed whitespace-pre-line">
              {config.body}
            </div>
          )}
        </div>

        {config.image && (
          <div className="flex items-center justify-center">
            <img
              src={config.image}
              alt={config.heading}
              className="rounded-xl border border-border/50 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

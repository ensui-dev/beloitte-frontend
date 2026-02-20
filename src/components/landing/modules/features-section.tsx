import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeaturesConfig } from "@/lib/config/site-config-schema";
import { icons as lucideIconMap, type LucideProps } from "lucide-react";

interface FeaturesSectionProps {
  readonly config: FeaturesConfig;
}

/**
 * Dynamically resolve a Lucide icon by name.
 * Uses lucide-react's `icons` export (a Record<string, LucideIcon>)
 * which is the type-safe way to do dynamic icon lookup.
 */
function getIcon(iconName: string): ComponentType<LucideProps> {
  // lucide-react exports `icons` as Record<string, LucideIcon>
  const icon = lucideIconMap[iconName as keyof typeof lucideIconMap];
  return icon ?? lucideIconMap.Box;
}

export function FeaturesSection({
  config,
}: FeaturesSectionProps): React.ReactElement {
  const gridClass =
    config.layout === "grid-2"
      ? "grid-cols-1 md:grid-cols-2"
      : config.layout === "list"
        ? "grid-cols-1 max-w-2xl mx-auto"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {config.heading}
        </h2>
        {config.subheading && (
          <p className="mt-4 text-lg text-muted-foreground">
            {config.subheading}
          </p>
        )}
      </div>

      <div className={`grid gap-6 ${gridClass}`}>
        {config.features.map((feature) => {
          const Icon = getIcon(feature.icon);
          return (
            <Card
              key={feature.title}
              className="group border-white/[0.06] bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150 transition-all hover:border-white/[0.12] hover:bg-white/[0.05]"
            >
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.1] text-primary transition-colors group-hover:bg-primary/[0.18]">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

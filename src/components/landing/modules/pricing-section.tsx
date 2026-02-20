import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { PricingConfig } from "@/lib/config/site-config-schema";

interface PricingSectionProps {
  readonly config: PricingConfig;
}

export function PricingSection({
  config,
}: PricingSectionProps): React.ReactElement {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="mb-16 text-center text-3xl font-bold tracking-tight md:text-4xl">
        {config.heading}
      </h2>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {config.plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative border-border/50 bg-card/50 backdrop-blur-sm ${
              plan.highlighted
                ? "border-primary/50 shadow-lg shadow-primary/10"
                : ""
            }`}
          >
            {plan.highlighted && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  {plan.price}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.ctaText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

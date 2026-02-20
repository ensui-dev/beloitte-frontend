import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TestimonialsConfig } from "@/lib/config/site-config-schema";

interface TestimonialsSectionProps {
  readonly config: TestimonialsConfig;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TestimonialsSection({
  config,
}: TestimonialsSectionProps): React.ReactElement {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="mb-16 text-3xl font-bold tracking-tight md:text-4xl">
        {config.heading}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {config.testimonials.map((testimonial) => (
          <Card
            key={testimonial.author}
            className="border-white/[0.06] bg-white/[0.03] backdrop-blur-xl backdrop-saturate-150"
          >
            <CardContent className="pt-6">
              <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  {testimonial.avatar && (
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.author}
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-xs text-primary">
                    {getInitials(testimonial.author)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">
                    {testimonial.author}
                  </div>
                  {testimonial.role && (
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqConfig } from "@/lib/config/site-config-schema";

interface FaqSectionProps {
  readonly config: FaqConfig;
}

export function FaqSection({ config }: FaqSectionProps): React.ReactElement {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-4xl">
        {config.heading}
      </h2>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 backdrop-blur-xl backdrop-saturate-150">
        <Accordion type="single" collapsible className="w-full">
          {config.items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white/[0.06]">
              <AccordionTrigger className="text-left text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

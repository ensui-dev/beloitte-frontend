import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ImageCarouselConfig } from "@/lib/config/site-config-schema";

interface ImageCarouselSectionProps {
  readonly config: ImageCarouselConfig;
}

export function ImageCarouselSection({
  config,
}: ImageCarouselSectionProps): React.ReactElement {
  if (config.images.length === 0) {
    return <></>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {config.images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="overflow-hidden rounded-xl border border-border/50">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/3] w-full object-cover"
                />
                {image.caption && (
                  <div className="bg-card/80 p-3 text-sm text-muted-foreground backdrop-blur-sm">
                    {image.caption}
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

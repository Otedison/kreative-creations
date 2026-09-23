"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import partners from "@/data/partners";

const PartnersCarousel = () => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: false,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {partners.map((partner) => (
          <CarouselItem 
            key={partner.name} 
            className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
          >
            <div className="flex items-center justify-center h-20 px-4 transition-all duration-300">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={48}
                className="max-h-12 w-auto object-contain rounded"
                loading="lazy"
                decoding="async"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default PartnersCarousel;

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SensorCard } from "@/components/dashboard/sensor-card";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import type { SensorMeta, SensorValues } from "@/lib/sensors";

type SensorCarouselProps = {
  sensors: SensorMeta[];
  values: SensorValues;
};

export function SensorCarousel({ sensors, values }: SensorCarouselProps) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollBy } = useHorizontalScroll();

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 sm:max-w-2xl lg:max-w-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sensors.map((sensor) => (
          <SensorCard key={sensor.topic} sensor={sensor} reading={values[sensor.topic]} />
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute top-1/2 left-0 flex size-8 -translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute top-1/2 right-0 flex size-8 translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-muted"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}

'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_IMAGE } from '@/constants/common';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const AUTOPLAY_MS = 5000;

function TopSliderSkeleton() {
  return (
    <section className="relative h-[500px] w-full overflow-hidden md:h-[600px]">
      <div className="absolute inset-0 bg-gray-800">
        <Skeleton className="h-full w-full rounded-none bg-gray-700/50" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="mx-auto w-full max-w-[1280px]">
            <Skeleton className="mb-3 h-6 w-24 rounded-md bg-gray-600/80" />
            <Skeleton className="mb-3 h-10 w-3/4 max-w-2xl bg-gray-500/80" />
            <Skeleton className="mb-4 h-5 w-full max-w-xl bg-gray-600/60" />
            <Skeleton className="mb-4 h-5 w-4/5 max-w-md bg-gray-600/60" />
            <div className="mb-4 flex gap-4">
              <Skeleton className="h-4 w-28 bg-gray-600/60" />
              <Skeleton className="h-4 w-24 bg-gray-600/60" />
            </div>
            <Skeleton className="h-10 w-28 rounded-md bg-gray-600/60" />
          </div>
        </div>
      </div>
    </section>
  );
}

const TopSlider = ({ relevants }: { relevants?: any[] }) => {
  const items = relevants ?? [];
  const [currentSlide, setCurrentSlide] = useState(0);

  const total = items.length;
  const hasMultiple = total > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!hasMultiple) return;
      setCurrentSlide((index + total) % total);
    },
    [hasMultiple, total]
  );

  const prevSlide = useCallback(
    () => goTo(currentSlide - 1),
    [currentSlide, goTo]
  );
  const nextSlide = useCallback(
    () => goTo(currentSlide + 1),
    [currentSlide, goTo]
  );

  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => goTo(currentSlide + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [hasMultiple, currentSlide, goTo]);

  if (!relevants || items.length === 0) {
    return <TopSliderSkeleton />;
  }

  return (
    <section className="relative h-[500px] w-full overflow-hidden md:h-[600px]">
      {items.map((slide: any, index: number) => (
        <div
          key={slide.id}
          aria-hidden={index !== currentSlide}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}>
          <div className="relative h-full w-full">
            <Image
              src={slide.image ?? DEFAULT_IMAGE}
              alt={slide.title ?? 'Coanime.net'}
              fill
              className="object-cover"
              unoptimized
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="mx-auto w-full max-w-[1280px]">
                {slide.categories?.name && (
                  <Badge className="mb-3 bg-orange-500 hover:bg-orange-600 border-0 text-white">
                    {slide.categories.name}
                  </Badge>
                )}
                <h1 className="mb-3 max-w-3xl text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mb-4 max-w-2xl text-gray-200 md:text-lg">
                  {slide.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  {slide.users?.name && <span>{slide.users.name}</span>}
                  {slide.users?.name &&
                    (slide.postponedTo ??
                      slide.createdAt ??
                      slide.created_at) && <span>•</span>}
                  {(slide.postponedTo ??
                    slide.createdAt ??
                    slide.created_at) && (
                    <span>
                      {dayjs(
                        slide.postponedTo ?? slide.createdAt ?? slide.created_at
                      )
                        .locale('es')
                        .format('D MMMM, YYYY')}
                    </span>
                  )}
                </div>
                <Button
                  className="mt-6 bg-orange-500 hover:bg-orange-600 border-0 text-white"
                  size="lg"
                  asChild>
                  <Link href={`/posts/${slide.slug}`}>Leer más</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {hasMultiple && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={prevSlide}>
            <ChevronLeftIcon className="h-6 w-6" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={nextSlide}>
            <ChevronRightIcon className="h-6 w-6" />
            <span className="sr-only">Siguiente</span>
          </Button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {items.map((_: any, index: number) => (
              <button
                key={index}
                type="button"
                className={`h-2 w-2 rounded-full ${
                  index === currentSlide ? 'bg-orange-500' : 'bg-white/50'
                }`}
                onClick={() => goTo(index)}>
                <span className="sr-only">Slide {index + 1}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default TopSlider;

'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React, { useRef } from 'react';

type HorizontalCarouselProps = {
  children: React.ReactNode;
  /** Gap between items in pixels */
  gap?: number;
  /** Optional class for the outer wrapper */
  className?: string;
  /** Optional class for the scroll area */
  scrollClassName?: string;
};

export function HorizontalCarousel({
  children,
  gap = 16,
  className = '',
  scrollClassName = '',
}: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'prev' | 'next') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 [-ms-overflow-style:none] [scrollbar-width:thin] ${scrollClassName}`}
        style={{
          gap,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}>
        {React.Children.map(children, (child) => (
          <div
            className="shrink-0 scroll-snap-align-start min-w-[calc(50%-6px)] sm:min-w-[calc(33.33%-6px)] md:min-w-[calc(25%-12px)] lg:min-w-[calc(16.666%-14px)]"
            style={{ scrollSnapAlign: 'start' }}>
            {child}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll('prev')}
        className="carousel-nav-prev absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-md transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        aria-label="Anterior">
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => scroll('next')}
        className="carousel-nav-next absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-md transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        aria-label="Siguiente">
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Post } from '@/types/posts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type HeroBannerProps = {
  relevants?: Post[] | unknown;
};

export function HeroBanner({ relevants }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Ensure relevants is an array
  const relevantsArray = Array.isArray(relevants) ? relevants : [];

  const nextSlide = () => {
    if (relevantsArray.length === 0) return;
    setCurrentSlide((prev) =>
      prev === relevantsArray.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (relevantsArray.length === 0) return;
    setCurrentSlide((prev) =>
      prev === 0 ? relevantsArray.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (relevantsArray.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relevantsArray.length]);

  // Don't render if there are no relevants
  if (relevantsArray.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {relevantsArray.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}>
          <div className="relative h-full w-full">
            <Image
              src={slide.image || '/placeholder.svg'}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container mx-auto">
                <Badge className="mb-3 bg-orange-500 hover:bg-orange-600">
                  {slide.categories.name}
                </Badge>
                <h1 className="mb-3 max-w-3xl text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="mb-4 max-w-2xl text-gray-200 md:text-lg">
                  {slide.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span>{slide.users.name}</span>
                  <span>•</span>
                  <span>{slide.created_at}</span>
                </div>
                <Button
                  className="mt-6 bg-orange-500 hover:bg-orange-600"
                  size="lg"
                  asChild>
                  <Link href={`/posts/${slide.slug}`}>Leer más</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}>
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Anterior</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}>
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Siguiente</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {relevantsArray.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? 'bg-orange-500' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}>
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

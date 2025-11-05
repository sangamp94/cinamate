import { ChevronRight } from "lucide-react";
import type { Movie } from "@shared/schema";
import { MovieCard } from "./MovieCard";
import { useRef } from "react";

interface CategoryCarouselProps {
  title: string;
  movies: Movie[];
  favorites?: Set<string>;
}

export function CategoryCarousel({ 
  title, 
  movies, 
  favorites = new Set() 
}: CategoryCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (movies.length === 0) return null;

  return (
    <section className="py-6" data-testid={`carousel-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <button 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid={`button-see-all-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <span>See All</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-40 md:w-48 snap-start">
            <MovieCard
              movie={movie}
              isFavorite={favorites.has(movie.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

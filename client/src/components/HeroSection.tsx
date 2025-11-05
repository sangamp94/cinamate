import { Play, Plus, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Movie } from "@shared/schema";
import { useState } from "react";

interface HeroSectionProps {
  movie: Movie;
  onAddToList?: () => void;
}

export function HeroSection({ movie, onAddToList }: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative h-[85vh] md:h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={imageError ? movie.poster : movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-end md:items-center px-4 md:px-8 pb-24 md:pb-16">
        <div className="max-w-2xl space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary/20 backdrop-blur-sm text-white border-none">
              {movie.group}
            </Badge>
            <div className="flex items-center gap-1 text-white">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-semibold">{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          <h1 
            className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg line-clamp-2"
            data-testid="hero-title"
          >
            {movie.title}
          </h1>

          <p className="text-base md:text-lg text-white/90 line-clamp-3 max-w-xl font-body">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href={`/player/${movie.id}`}>
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary text-primary-foreground gap-2 min-h-12"
                data-testid="button-watch-now"
              >
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            
            <Button
              size="lg"
              variant="outline"
              className="bg-background/20 backdrop-blur-md border-white/30 text-white hover:bg-background/30 gap-2 min-h-12"
              onClick={onAddToList}
              data-testid="button-add-to-list"
            >
              <Plus className="h-5 w-5" />
              My List
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-background/20 backdrop-blur-md border-white/30 text-white hover:bg-background/30 gap-2 min-h-12"
              data-testid="button-more-info"
            >
              <Info className="h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

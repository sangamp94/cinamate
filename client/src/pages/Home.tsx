import { useQuery } from "@tanstack/react-query";
import type { Movie } from "@shared/schema";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: movies = [], isLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  const { data: favorites = [] } = useQuery<string[]>({
    queryKey: ["/api/favorites"],
  });

  const favoritesSet = new Set(favorites);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <div className="h-[85vh] md:h-[70vh] bg-muted animate-pulse" />
        <div className="px-4 py-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="flex-none w-40 h-60 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const featuredMovie = movies.find(m => m.rating >= 8.0) || movies[0];
  
  const groupedMovies = movies.reduce((acc, movie) => {
    if (!acc[movie.group]) {
      acc[movie.group] = [];
    }
    acc[movie.group].push(movie);
    return acc;
  }, {} as Record<string, Movie[]>);

  const trending = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {featuredMovie && <HeroSection movie={featuredMovie} />}

      <div className="space-y-8 -mt-20 relative z-10">
        {trending.length > 0 && (
          <CategoryCarousel 
            title="Trending Now" 
            movies={trending} 
            favorites={favoritesSet}
          />
        )}
        
        {Object.entries(groupedMovies).map(([group, groupMovies]) => (
          <CategoryCarousel
            key={group}
            title={group}
            movies={groupMovies}
            favorites={favoritesSet}
          />
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}

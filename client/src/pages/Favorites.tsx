import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import type { Movie } from "@shared/schema";
import { MovieCard } from "@/components/MovieCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Favorites() {
  const { data: favorites = [], isLoading } = useQuery<string[]>({
    queryKey: ["/api/favorites"],
  });

  const { data: allMovies = [] } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  const favoriteMovies = allMovies.filter(movie => favorites.includes(movie.id));
  const favoritesSet = new Set(favorites);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">My Favorites</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
            ))}
          </div>
        ) : favoriteMovies.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">
              Start adding movies to your favorites to see them here
            </p>
            <Link href="/">
              <Button data-testid="button-browse">Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {favoriteMovies.length} {favoriteMovies.length === 1 ? 'movie' : 'movies'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {favoriteMovies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  isFavorite={favoritesSet.has(movie.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

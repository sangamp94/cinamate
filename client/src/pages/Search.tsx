import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Filter } from "lucide-react";
import type { Movie } from "@shared/schema";
import { MovieCard } from "@/components/MovieCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { data: movies = [], isLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  const { data: favorites = [] } = useQuery<string[]>({
    queryKey: ["/api/favorites"],
  });

  const favoritesSet = new Set(favorites);
  const groups = Array.from(new Set(movies.map(m => m.group))).sort();

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = !selectedGroup || movie.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies, anime..."
                className="pl-10 h-12 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <button 
              className="min-h-12 min-w-12 flex items-center justify-center rounded-md border border-border hover-elevate active-elevate-2"
              data-testid="button-filter"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <Badge
              variant={selectedGroup === null ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap hover-elevate active-elevate-2"
              onClick={() => setSelectedGroup(null)}
              data-testid="filter-all"
            >
              All
            </Badge>
            {groups.map(group => (
              <Badge
                key={group}
                variant={selectedGroup === group ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap hover-elevate active-elevate-2"
                onClick={() => setSelectedGroup(group)}
                data-testid={`filter-${group.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {group}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No movies found for "${searchQuery}"`
                : "Try searching for a movie or anime"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMovies.map(movie => (
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

import { Star, Play, Heart } from "lucide-react";
import { Link } from "wouter";
import type { Movie } from "@shared/schema";
import { useState, type MouseEvent } from "react"; // Combined imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
}

export function MovieCard({ movie, isFavorite }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const queryClient = useQueryClient();

  // Define the common type for the movieId argument in mutations
  type MovieId = Movie["id"];

  const onSuccessCallback = () => {
    // Invalidate the favorites cache to reflect the change immediately
    queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
  };

  const addFavoriteMutation = useMutation<unknown, Error, MovieId>({
    mutationFn: (movieId) => {
      return apiRequest("POST", "/api/favorites", { movieId });
    },
    onSuccess: onSuccessCallback,
  });

  const removeFavoriteMutation = useMutation<unknown, Error, MovieId>({
    mutationFn: (movieId) => {
      return apiRequest("DELETE", `/api/favorites/${movieId}`);
    },
    onSuccess: onSuccessCallback,
  });

  // Explicitly type the event for better type safety
  const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent action if a mutation is already pending
    if (isPending) return; 

    if (isFavorite) {
      removeFavoriteMutation.mutate(movie.id);
    } else {
      addFavoriteMutation.mutate(movie.id);
    }
  };

  // Determine the current loading state for the favorite button
  const isPending =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <Link href={`/player/${movie.id}`}>
      <div
        data-testid={`card-movie-${movie.id}`}
        className="group relative aspect-[2/3] rounded-lg overflow-hidden hover-elevate active-elevate-2 cursor-pointer"
      >
        <img
          src={
            imageError
              ? "https://via.placeholder.com/300x450?text=No+Image"
              : movie.poster
          }
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold">
            {/* FIX: Safely access movie.rating to prevent the 'toFixed' error */}
            {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
          </span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 left-2 p-2 bg-background/90 backdrop-blur-sm rounded-full transition-opacity ${
              isPending ? 'cursor-not-allowed opacity-50' : 'hover-elevate active-elevate-2'
          }`}
          data-testid={`button-favorite-${movie.id}`}
          disabled={isPending} // Disable button while a mutation is running
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
              {movie.title}
            </h3>
            <p className="text-xs text-white/80 mb-2">{movie.group}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Play className="h-3 w-3 fill-white text-white" />
                <span className="text-xs font-semibold text-white">Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
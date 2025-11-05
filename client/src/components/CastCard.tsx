import type { CastMember } from "@shared/schema";
import { User } from "lucide-react";

interface CastCardProps {
  cast: CastMember;
}

export function CastCard({ cast }: CastCardProps) {
  const imageUrl = cast.profile_path
    ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
    : null;

  return (
    <div 
      className="flex-none w-24 md:w-28 snap-start" 
      data-testid={`cast-${cast.id}`}
    >
      <div className="aspect-square rounded-full overflow-hidden bg-muted mb-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cast.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium line-clamp-1">{cast.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{cast.character}</p>
      </div>
    </div>
  );
}

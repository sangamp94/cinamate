import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Calendar, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import type { Movie, CastMember } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CastCard } from "@/components/CastCard";
import { MovieCard } from "@/components/MovieCard";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useRef, useEffect } from "react";

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const { data: movie, isLoading: movieLoading } = useQuery<Movie>({
    queryKey: ["/api/movies", id],
    queryFn: async () => {
      const response = await fetch(`/api/movies/${id}`);
      if (!response.ok) throw new Error('Failed to fetch movie');
      return response.json();
    },
  });

  const { data: cast = [], isLoading: castLoading } = useQuery<CastMember[]>({
    queryKey: ["/api/cast", movie?.tmdb_id, movie?.title],
    queryFn: async () => {
      if (!movie) return [];
      const response = await fetch(`/api/cast/${movie.tmdb_id}/${encodeURIComponent(movie.title)}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!movie,
  });

  const { data: allMovies = [] } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  const relatedMovies = allMovies
    .filter(m => m.group === movie?.group && m.id !== movie?.id)
    .slice(0, 6);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <Skeleton className="w-full h-[56.25vw] max-h-[70vh]" />
        <div className="px-4 py-6 space-y-6 max-w-7xl mx-auto">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Movie not found</h2>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div 
        className="relative w-full bg-black group"
        style={{ height: 'min(56.25vw, 70vh)' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={movie.url}
          className="w-full h-full"
          onClick={togglePlay}
          poster={movie.backdrop}
        />

        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                data-testid="button-back"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            <div 
              className="h-1 bg-white/30 rounded-full cursor-pointer group/progress"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                  data-testid="button-play-pause"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => skip(-10)}
                  className="text-white hover:bg-white/20"
                  data-testid="button-skip-back"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => skip(10)}
                  className="text-white hover:bg-white/20"
                  data-testid="button-skip-forward"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <span className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                  data-testid="button-mute"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                  data-testid="button-fullscreen"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold" data-testid="movie-title">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-lg font-semibold">{movie.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{movie.release_date}</span>
            </div>

            <Badge variant="secondary">{movie.group}</Badge>
          </div>

          <p className="text-base md:text-lg text-muted-foreground font-body leading-relaxed max-w-4xl">
            {movie.overview}
          </p>
        </div>

        {cast.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Cast</h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
              {cast.map(member => (
                <CastCard key={member.id} cast={member} />
              ))}
            </div>
          </div>
        )}

        {relatedMovies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">More Like This</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {relatedMovies.map(relatedMovie => (
                <MovieCard 
                  key={relatedMovie.id} 
                  movie={relatedMovie}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

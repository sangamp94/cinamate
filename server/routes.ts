import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import type { Movie, CastMember } from "@shared/schema";

const MOVIES_JSON_URL = "https://raw.githubusercontent.com/sangamp94/otp/refs/heads/main/movie.json";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

let moviesCache: Movie[] = [];
let moviesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchMovies(): Promise<Movie[]> {
  const now = Date.now();
  if (moviesCache.length > 0 && now - moviesCacheTime < CACHE_DURATION) {
    return moviesCache;
  }

  try {
    const response = await axios.get<Movie[]>(MOVIES_JSON_URL);
    moviesCache = response.data;
    moviesCacheTime = now;
    return moviesCache;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return moviesCache.length > 0 ? moviesCache : [];
  }
}

async function fetchCastFromTMDB(tmdbId: number, title: string): Promise<CastMember[]> {
  if (!TMDB_API_KEY) {
    console.warn("TMDB_API_KEY not configured");
    return [];
  }

  try {
    let movieId = tmdbId;

    if (!movieId || movieId === 0) {
      const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          api_key: TMDB_API_KEY,
          query: title,
          page: 1,
        },
      });

      if (searchResponse.data.results && searchResponse.data.results.length > 0) {
        movieId = searchResponse.data.results[0].id;
      } else {
        return [];
      }
    }

    const mediaType = title.toLowerCase().includes('season') || 
                     title.toLowerCase().includes('episode') ? 'tv' : 'movie';
    
    const creditsResponse = await axios.get(
      `${TMDB_BASE_URL}/${mediaType}/${movieId}/credits`,
      {
        params: {
          api_key: TMDB_API_KEY,
        },
      }
    );

    const cast = creditsResponse.data.cast || [];
    return cast.slice(0, 10).map((member: any) => ({
      id: member.id,
      name: member.name,
      character: member.character || "Unknown",
      profile_path: member.profile_path,
      order: member.order,
    }));
  } catch (error) {
    console.error("Error fetching cast from TMDB:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/movies", async (_req, res) => {
    try {
      const movies = await fetchMovies();
      res.json(movies);
    } catch (error) {
      console.error("Error in /api/movies:", error);
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movies = await fetchMovies();
      const movie = movies.find((m) => m.id === req.params.id);
      
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      
      res.json(movie);
    } catch (error) {
      console.error("Error in /api/movies/:id:", error);
      res.status(500).json({ error: "Failed to fetch movie" });
    }
  });

  app.get("/api/cast/:tmdbId/:title", async (req, res) => {
    try {
      const tmdbId = parseInt(req.params.tmdbId);
      const title = decodeURIComponent(req.params.title);
      
      const cast = await fetchCastFromTMDB(tmdbId, title);
      res.json(cast);
    } catch (error) {
      console.error("Error in /api/cast:", error);
      res.status(500).json({ error: "Failed to fetch cast" });
    }
  });

  app.get("/api/favorites", async (_req, res) => {
    try {
      const favorites = await storage.getFavorites();
      res.json(favorites);
    } catch (error) {
      console.error("Error in /api/favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const { movieId } = req.body;
      
      if (!movieId) {
        return res.status(400).json({ error: "movieId is required" });
      }
      
      await storage.addFavorite(movieId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error in POST /api/favorites:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      await storage.removeFavorite(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error in DELETE /api/favorites:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

import type { Favorite } from "@shared/schema";

export interface IStorage {
  getFavorites(): Promise<string[]>;
  addFavorite(movieId: string): Promise<void>;
  removeFavorite(movieId: string): Promise<void>;
  isFavorite(movieId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private favorites: Set<string>;

  constructor() {
    this.favorites = new Set();
  }

  async getFavorites(): Promise<string[]> {
    return Array.from(this.favorites);
  }

  async addFavorite(movieId: string): Promise<void> {
    this.favorites.add(movieId);
  }

  async removeFavorite(movieId: string): Promise<void> {
    this.favorites.delete(movieId);
  }

  async isFavorite(movieId: string): Promise<boolean> {
    return this.favorites.has(movieId);
  }
}

export const storage = new MemStorage();

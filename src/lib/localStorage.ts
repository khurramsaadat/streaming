import { OmdbMovie } from "./omdb";

const STORAGE_KEY = "continueWatching";

export function getContinueWatching(): OmdbMovie[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as OmdbMovie[];
  } catch {
    return [];
  }
}

export function addContinueWatching(movie: OmdbMovie) {
  if (typeof window === "undefined") return;
  let list = getContinueWatching();
  // Remove if already exists
  list = list.filter((m) => m.imdbID !== movie.imdbID);
  // Add to front
  list.unshift(movie);
  // Limit to 10
  if (list.length > 10) list = list.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function removeContinueWatching(imdbID: string) {
  if (typeof window === "undefined") return;
  let list = getContinueWatching();
  list = list.filter((m) => m.imdbID !== imdbID);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
} 
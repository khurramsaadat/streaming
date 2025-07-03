"use client";
import React, { useEffect, useState } from "react";
import { searchMovies, OmdbMovie } from "../lib/omdb";
import {
  getContinueWatching,
  addContinueWatching,
  removeContinueWatching,
} from "../lib/localStorage";
import Link from "next/link";

function PlayIcon({ filled = false }: { filled?: boolean }) {
  return filled ? (
    <svg width="20" height="20" fill="currentColor" className="text-indigo-400"><circle cx="10" cy="10" r="10" fill="currentColor" opacity=".2"/><polygon points="8,6 14,10 8,14" fill="currentColor" /></svg>
  ) : (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><circle cx="10" cy="10" r="9" stroke="currentColor" opacity=".2"/><polygon points="8,6 14,10 8,14" fill="currentColor" /></svg>
  );
}

export default function Home() {
  const [movies, setMovies] = useState<OmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [continueWatching, setContinueWatching] = useState<OmdbMovie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies("Avengers");
        setMovies(data);
      } catch (e) {
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
    setContinueWatching(getContinueWatching());
  }, []);

  function handleToggleContinue(movie: OmdbMovie) {
    const exists = continueWatching.some((m) => m.imdbID === movie.imdbID);
    if (exists) {
      removeContinueWatching(movie.imdbID);
      setContinueWatching(getContinueWatching());
    } else {
      addContinueWatching(movie);
      setContinueWatching(getContinueWatching());
    }
  }

  // Card size classes
  const cardClass =
    "bg-zinc-800 rounded-lg p-0.5 flex flex-col items-center relative max-w-[90px] sm:max-w-[110px] md:max-w-[130px] mx-auto";
  const imgClass =
    "w-full aspect-[2/3] object-cover rounded mb-0.5";
  const titleClass =
    "font-semibold text-center line-clamp-2 mt-0.5 text-[10px] sm:text-xs";
  const yearClass =
    "text-[10px] text-zinc-400";
  const playBtnClass =
    "absolute top-0.5 right-0.5 rounded-full p-0.5 transition z-10 text-xs";

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="w-full px-2 py-3 flex items-center justify-between border-b border-zinc-800">
        <div className="text-lg sm:text-2xl font-bold tracking-tight">MovieStream</div>
        <input
          type="text"
          placeholder="Search movies..."
          className="bg-zinc-800 text-zinc-100 rounded px-2 py-1 w-32 sm:w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-base"
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col gap-8 sm:gap-10">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">Continue Watching</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-1">
              {continueWatching.map((movie) => (
                <Link href={`/movie/${movie.imdbID}`} className="block w-full" key={movie.imdbID}>
                  <div className={cardClass + " cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"}>
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className={imgClass}
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-zinc-700 rounded mb-1 flex items-center justify-center text-zinc-400 text-xs">No Image</div>
                    )}
                    <button
                      className={playBtnClass + " bg-zinc-900/80 hover:bg-indigo-600"}
                      title="Remove from Continue Watching"
                      onClick={() => handleToggleContinue(movie)}
                    >
                      <PlayIcon filled={true} />
                    </button>
                    <div className={titleClass}>{movie.Title}</div>
                    <div className={yearClass}>{movie.Year}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Popular Movies */}
        <section>
          <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">Popular Movies</h2>
          {error && <div className="text-red-400 mb-4">{error}</div>}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-1">
            {loading && (
              <div className="col-span-full text-center text-zinc-400">Loading...</div>
            )}
            {movies.map((movie) => {
              const inContinue = continueWatching.some((m) => m.imdbID === movie.imdbID);
              return (
                <Link href={`/movie/${movie.imdbID}`} className="block w-full" key={movie.imdbID}>
                  <div className={cardClass + " cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"}>
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className={imgClass}
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-zinc-700 rounded mb-0.5 flex items-center justify-center text-zinc-400 text-xs">No Image</div>
                    )}
                    <button
                      className={
                        playBtnClass +
                        (inContinue
                          ? " bg-indigo-600"
                          : " bg-zinc-900/80 hover:bg-indigo-600")
                      }
                      title={inContinue ? "Remove from Continue Watching" : "Add to Continue Watching"}
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleToggleContinue(movie); }}
                      style={{ pointerEvents: "auto", zIndex: 10 }}
                    >
                      <PlayIcon filled={inContinue} />
                    </button>
                    <div className={titleClass}>{movie.Title}</div>
                    <div className={yearClass}>{movie.Year}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 sm:py-4 text-center text-zinc-500 text-xs sm:text-sm border-t border-zinc-800">
        © 2025 MovieStream. Personal use only. Inspired by FMovies.
      </footer>
    </div>
  );
}

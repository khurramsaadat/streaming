import React, { Suspense } from "react";
import { getMovieById, OmdbMovieDetail } from "../../../lib/omdb";
import Link from "next/link";

// Helper to get YouTube embed URL by searching for trailer
async function getYouTubeTrailerUrl(title: string): Promise<string | null> {
  // Use YouTube search embed (no API key needed for basic search)
  // This will embed the first search result for "{title} trailer"
  const query = encodeURIComponent(`${title} trailer`);
  return `https://www.youtube.com/embed?listType=search&list=${query}`;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center px-2 py-6 animate-pulse">
      <div className="w-full max-w-4xl bg-zinc-800 rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 w-full md:w-56 flex justify-center items-start">
          <div className="w-40 md:w-56 aspect-[2/3] bg-zinc-700 rounded" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-8 bg-zinc-700 rounded w-2/3 mb-2" />
          <div className="h-4 bg-zinc-700 rounded w-1/2 mb-2" />
          <div className="h-16 bg-zinc-700 rounded w-full mb-2" />
          <div className="h-4 bg-zinc-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-zinc-700 rounded w-2/3 mb-2" />
          <div className="h-10 bg-indigo-700 rounded w-32 mt-2" />
        </div>
      </div>
      <div className="w-full max-w-4xl mt-8 aspect-video bg-zinc-800 rounded-lg" />
    </div>
  );
}

function ErrorCard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 px-4">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 5c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-bold text-red-400 mb-2">Movie not found or OMDb fetch failed</h2>
        <p className="text-zinc-300 mb-4 text-center">We couldn't load this movie. Please check your internet connection or try again later.</p>
        <Link href="/" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded transition">Back to Home</Link>
      </div>
    </div>
  );
}

export default async function MovieDetailPage(props: { params: Promise<{ imdbID: string }> }) {
  const params = await props.params;
  let movie: OmdbMovieDetail | null = null;
  try {
    movie = await getMovieById(params.imdbID);
  } catch (error) {
    movie = null;
  }
  if (!movie) {
    return <ErrorCard />;
  }
  const trailerUrl = await getYouTubeTrailerUrl(movie.Title);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center px-2 py-6">
        <div className="w-full max-w-4xl bg-zinc-800 rounded-lg shadow-lg p-4 flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-56 flex justify-center items-start">
            {movie.Poster && movie.Poster !== "N/A" ? (
              <img src={movie.Poster} alt={movie.Title} className="rounded w-40 md:w-56 aspect-[2/3] object-cover" />
            ) : (
              <div className="w-40 md:w-56 aspect-[2/3] bg-zinc-700 rounded flex items-center justify-center text-zinc-400 text-xs">No Image</div>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-2xl font-bold mb-1">{movie.Title}</h1>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400 mb-2">
              <span>{movie.Year}</span>
              <span>| {movie.Genre}</span>
              <span>| {movie.Runtime}</span>
              <span>| IMDb: {movie.imdbRating}</span>
            </div>
            <p className="text-zinc-200 mb-2 line-clamp-5">{movie.Plot}</p>
            <div className="text-xs text-zinc-400 mb-2">Director: {movie.Director}</div>
            <div className="text-xs text-zinc-400 mb-2">Actors: {movie.Actors}</div>
            <a
              href="#trailer"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded transition w-max mt-2"
            >
              Watch Now
            </a>
          </div>
        </div>
        {/* Video Player */}
        <div id="trailer" className="w-full max-w-4xl mt-8 aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {trailerUrl ? (
            <iframe
              src={trailerUrl}
              title="YouTube Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="text-zinc-400">Trailer not available.</div>
          )}
        </div>
      </div>
    </Suspense>
  );
} 
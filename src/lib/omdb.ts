const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

if (!OMDB_API_KEY) {
  throw new Error('OMDB_API_KEY is not set in environment variables');
}

export interface OmdbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbMovieDetail extends OmdbMovie {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}

export async function searchMovies(query: string, page = 1): Promise<OmdbMovie[]> {
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'True') {
    return data.Search;
  }
  return [];
}

export async function getMovieById(imdbID: string): Promise<OmdbMovieDetail | null> {
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    if (data.Response === 'True') {
      return data as OmdbMovieDetail;
    }
    return null;
  } catch (error) {
    console.error('OMDb fetch failed:', error);
    return null;
  }
} 
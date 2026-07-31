import { env } from "../config/env.js";
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovie({ title, year }) {
  const data = await request("/search/movie", {
    query: title,
    year,
  });

  return data.results.map((movie) => ({
    id: movie?.id,
    title: movie?.title,
    year: movie?.release_date ? Number(movie?.release_date.slice(0, 4)) : null,
    poster: movie?.poster_path,
  }));
}

async function request(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.set("api_key", env.tmdbApiKey);

  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, value);
  }

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const signal = AbortSignal.timeout(10_000);

      const response = await fetch(url, { signal });

      if (!response.ok) throw new Error(`TMDb returned ${response.status}`);

      return await response.json();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw lastError;
}

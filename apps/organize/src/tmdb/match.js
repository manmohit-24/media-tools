import { request } from "./request.js";

export async function matchMovie(file) {
  const matches = await searchMovie(file.query);
  if (matches.length === 0) throw new Error("No match found");
  file.match = matches[0] ?? null;
}

async function searchMovie({ title, year }) {
  const data = await request("/search/movie", {
    query: title,
    year,
  });

  return data.results.map((movie) => ({
    id: movie?.id,
    title: movie?.title,
    release_date: movie.release_date || null,
    poster: movie?.poster_path,
  }));
}

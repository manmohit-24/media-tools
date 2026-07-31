import { getMovie } from "./client.js";

export async function fetchMovieDetails(file) {
  if (!file.match) return;

  file.movie = await getMovie(file.match.id);
}

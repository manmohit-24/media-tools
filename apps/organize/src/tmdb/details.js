import { getMovie } from "./client.js";

export async function fetchMovieDetails(ctx) {
  for (const file of ctx.files) {
    if (!file.match) continue;

    file.movie = await getMovie(file.match.id);
    delete file.match;
  }
}

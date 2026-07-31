import { searchMovie } from "./client.js";

export async function matchMovies(ctx) {
  for (const file of ctx.files) {
    try {
      const matches = await searchMovie(file.query);

      file.match = matches[0] ?? null;
    } catch (error) {
      file.match = null;
    }
  }
}

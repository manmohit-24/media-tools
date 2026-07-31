import { searchMovie } from "./client.js";

export async function matchMovie(file) {
  try {
    const matches = await searchMovie(file.query);

    file.match = matches[0] ?? null;
  } catch (error) {
    file.match = null;
  }
}

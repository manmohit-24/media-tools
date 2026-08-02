import { searchMovie } from "./client.js";

export async function matchMovie(file) {
  const matches = await searchMovie(file.query);
  if (matches.length === 0) throw new Error("No match found");
  file.match = matches[0] ?? null;
}

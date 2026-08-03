import { request } from "./request.js";
import { select } from "@inquirer/prompts";

export async function matchMovie(file, interactive = false) {
  const matches = await searchMovie(file.query);

  if (matches.length === 0) {
    throw new Error("No match found");
  }

  file.match =
    interactive && matches.length > 1
      ? await chooseMovie(matches, file.name)
      : matches[0];
}

export async function chooseMovie(matches, name) {
  const choice = await select({
    message: `Multiple matches found for ${name}`,
    choices: matches.map((movie) => ({
      name: `${movie.title} (${movie.release_date?.slice(0, 4) ?? "----"})`,
      value: movie,
    })),
  });

  return choice;
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

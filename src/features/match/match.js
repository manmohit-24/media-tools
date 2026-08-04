import { select } from "@inquirer/prompts";
import { searchMovie } from "../../providers/media/index.js";

export async function matchMovie(file, interactive = false) {
  const matches = await searchMovie(file.query);

  if (matches.length === 0) throw new Error("No match found");

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

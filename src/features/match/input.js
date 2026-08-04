import { select, input } from "@inquirer/prompts";

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

export async function promptMovie(fileName) {
  const value = await input({
    message: `Processing file : ${fileName} \n Movie name or TMDb ID:`,
    placeholder: "e.g. Interstellar or 157336",
    validate(value) {
      return value.trim() ? true : "Please enter a movie name or TMDb ID.";
    },
  });

  return value.trim();
}

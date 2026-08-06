import { select, input, Separator } from "@inquirer/prompts";
import { shutdown } from "../../app/shutdown.js";

const SKIP = Symbol("skip");

export async function chooseMovie(matches, name) {
  try {
    const choice = await select({
      message: `Multiple matches found for ${name}`,
      choices: [
        ...matches.map((movie) => ({
          name: `${movie.title} (${movie.release_date?.slice(0, 4) ?? "----"})`,
          value: movie,
        })),
        new Separator(),
        {
          name: "Skip this file",
          value: SKIP,
        },
      ],
    });

    if (choice === SKIP) throw new Error("File Skipped");

    return choice;
  } catch (error) {
    if (error.name === "ExitPromptError") return shutdown.request();
    throw error;
  }
}

export async function promptMovie(fileName) {
  try {
    const value = await input({
      message: `Processing file : ${fileName} \n Movie name or TMDb ID (leave empty to skip) :`,
      placeholder: "e.g. Interstellar or 157336",
    });

    const trimmed = value.trim();

    if (!trimmed) throw new Error("File Skipped");

    return trimmed;
  } catch (error) {
    if (error.name === "ExitPromptError") return shutdown.request();
    throw error;
  }
}

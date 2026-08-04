import { chooseMovie, promptMovie } from "./input.js";

import { spinner } from "../../app/spinner.js";
import { resolveTitle } from "../../shared/resolve/title.js";
import { searchMovie, searchMovieById } from "../../providers/media/index.js";

export async function guidedMatchMovie(file) {
  const value = await spinner.suspend(() => promptMovie(file.name));
  spinner.step("Finding a Match");

  // testing for id format
  if (/^\d+$/.test(value)) {
    file.match = await searchMovieById(Number(value));
    return;
  }

  const matches = await searchMovie({ title: value });

  if (matches.length === 0) throw new Error("No match found");

  file.match = await spinner.suspend(() => chooseMovie(matches, file.name));
}

export async function autoMatchMovie(file) {
  spinner.step("Finding a Match");
  query = resolveTitle(file.metadata.title, file.name);

  const matches = await searchMovie(query);
  if (matches.length === 0) throw new Error("No match found");
  file.match = matches[0];
}

export async function interactiveMatchMovie(file) {
  const query = resolveTitle(file.metadata.title, file.name);
  const matches = await searchMovie(query);
  if (matches.length === 0) throw new Error("No match found");

  file.match = await spinner.suspend(() => chooseMovie(matches, file.name));
}

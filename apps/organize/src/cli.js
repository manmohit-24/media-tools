import { logger } from "./shared/logger.js";
import { scan } from "./filesystem/scan.js";
import { readMetadata } from "./metadata/read.js";
import { resolveTitle } from "./resolver/title.js";
import { matchMovie } from "./tmdb/match.js";
import { fetchMovieDetails } from "./tmdb/details.js";

const [_node, _script, path, ...options] = process.argv;

const input = {
  path,
  options: {
    recursive: options.includes("-r") || options.includes("--recursive"),
  },
};

try {
  logger.info("Initializing Media Tools : Organize");
  const files = await scan(input);

  for (const file of files) {
    await readMetadata(file);
    await resolveTitle(file);
    await matchMovie(file);
    await fetchMovieDetails(file);
    console.dir(file, { depth: 2 });
  }
} catch (err) {
  logger.error(err);
  process.exit(1);
}

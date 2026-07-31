import { logger } from "./shared/logger.js";
import { scan } from "./filesystem/scan.js";
import { readMetadata } from "./metadata/read.js";
import { resolveTitle } from "./resolver/title.js";
import { matchMovies } from "./tmdb/match.js";
import { fetchMovieDetails } from "./tmdb/details.js";

const [_node, _script, input, ...options] = process.argv;

const ctx = {
  input,
  options: {
    recursive: options.includes("-r") || options.includes("--recursive"),
  },
};

try {
  logger.info("Initializing Media Tools : Organize");
  await scan(ctx);
  await readMetadata(ctx);
  await resolveTitle(ctx);
  await matchMovies(ctx);
  await fetchMovieDetails(ctx);
  console.dir(ctx.files, { depth: 2 });
} catch (err) {
  logger.error(err);
  process.exit(1);
}

import { logger } from "./shared/logger.js";
import { scan } from "./filesystem/scan.js";
import { readMetadata } from "./metadata/read.js";
import { resolveTitle } from "./resolver/title.js";
import { matchMovie } from "./tmdb/match.js";
import { fetchMovieDetails } from "./tmdb/details.js";
import { addStandardMeta } from "./metadata/build.js";
import { updateMetadata } from "./update/index.js";

const [_node, _script, path, ...options] = process.argv;

const input = {
  path,
  options: {
    recursive: options.includes("-r") || options.includes("--recursive"),
  },
};

let files;

try {
  logger.info("Initializing Media Tools : Organize");
  files = await scan(input);
} catch (err) {
  logger.error("Error scanning directory");
  logger.error(err);
  process.exit(1);
}

for (const file of files) {
  try {
    await readMetadata(file);
    await resolveTitle(file);
    await matchMovie(file);
    await fetchMovieDetails(file);
    addStandardMeta(file);
    await updateMetadata(file);
  } catch (error) {
    logger.error("Error for ", file.name);
    logger.error(error);
  } finally {
    console.dir(file, { depth: 3 });
  }
}

#!/usr/bin/env node

import { logger } from "./shared/logger.js";
import { createSpinner } from "./shared/spinner.js";

import { scan } from "./filesystem/scan.js";
import { renameFile } from "./filesystem/rename.js";

import { readMetadata } from "./metadata/read.js";
import { addStandardMeta } from "./metadata/build.js";

import { resolveTitle } from "./resolver/title.js";

import { matchMovie } from "./tmdb/match.js";

import { updateMetadata } from "./update/index.js";

import { updateTimestamps } from "./timestamps/timestamps.js";

const [_node, _script, path, ...options] = process.argv;

const input = {
  path,
  options: {
    recursive: options.includes("-r") || options.includes("--recursive"),
    interactive: options.includes("-i") || options.includes("--interactive"),
  },
};

logger.divider();
logger.title("Media Tools");
logger.text("Mode        : Organize");
logger.text(`Path        : ${input.path}`);
logger.text(`Recursive   : ${input.options.recursive}`);
logger.text(`Interactive : ${input.options.interactive}`);
logger.divider();

let files;

const scanSpinner = createSpinner("Scanning library...").start();

try {
  files = await scan(input);
  scanSpinner.succeed(`Found ${files.length} media files`);
} catch (err) {
  scanSpinner.fail("Failed to scan library");
  logger.error(err.message);
  process.exit(1);
}

logger.divider();

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const label = `[${i + 1}/${files.length}] ${file.name}`;
  const spinner = createSpinner(label).start();

  try {
    spinner.text = `Reading metadata`;
    await readMetadata(file);

    spinner.text = `Resolving title`;
    await resolveTitle(file);

    spinner.text = `Finding TMDb match`;
    await matchMovie(file, input.options.interactive);

    spinner.text = `Building metadata`;
    addStandardMeta(file);

    spinner.text = `Updating media`;
    await updateMetadata(file);

    spinner.text = `Renaming file`;
    await renameFile(file);

    spinner.text = `Updating Timestamps`;
    await updateTimestamps(file);

    spinner.succeed(`${label} -> ${file.name}`);
  } catch (error) {
    spinner.fail(label);
    logger.muted(`    ${error.message}`);
  }
}

logger.divider();
logger.success("Completed");
logger.info("Keep sorted with 'First Modified' for sort in release order");

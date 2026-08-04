#!/usr/bin/env node

import { logger } from "./shared/logger.js";
import { spinner } from "./app/spinner.js";

import { scan } from "./features/scan/scan.js";
import { renameFile } from "./features/rename/rename.js";

import { readMetadata } from "./features/metadata/read.js";
import { addStandardMeta } from "./features/standardize/standardize.js";

import { interactiveMatchMovie } from "./features/match/match.js";

import { updateMetadata } from "./features/writer/index.js";

import { updateTimestamps } from "./features/timestamps/timestamps.js";

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

spinner.start("");

try {
  spinner.step("Scanning Files");
  files = await scan(input);
  logger.success(`Found ${files.length} media files`);
} catch (err) {
  spinner.fail("Failed to scan library");
  logger.error(err.message);
  process.exit(1);
}

logger.divider();

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const label = `[${i + 1}/${files.length}] ${file.name}`;
  spinner.step(label);
  try {
    await readMetadata(file);

    await interactiveMatchMovie(file);

    await addStandardMeta(file);

    await updateMetadata(file);

    await renameFile(file);

    await updateTimestamps(file);

    logger.success(`${label} -> ${file.name}`);
  } catch (error) {
    logger.error(label);
    logger.muted(`    ${error.message}`);
    logger.error(error);
  }
}

logger.divider();
spinner.success("Completed");
logger.info("Keep sorted with 'First Modified' for sort in release order");

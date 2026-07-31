import { logger } from "./shared/logger.js";
import { scan } from "./filesystem/scan.js";
import { readMetadata } from "./metadata/read.js";

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
  console.dir(ctx.files, { depth: null });
} catch (err) {
  logger.error(err.message);
  process.exit(1);
}

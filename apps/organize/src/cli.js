import { logger } from "./shared/logger.js";
import { scan } from "./filesystem/scan.js";

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
  logger.info(ctx.files);
} catch (err) {
  logger.error(err.message);
  process.exit(1);
}

import { spinner } from "../app/spinner.js";
import { logger } from "../shared/logger.js";

export async function wrap({ file, i, total }, handler) {
  const label = `[${i + 1}/${total}] ${file.name}`;

  spinner.step(label);

  try {
    await handler(file);

    logger.success(`${label} -> ${file.name}`);
  } catch (error) {
    logger.error(label);
    logger.muted(`    ${error.message}`);
  }
}

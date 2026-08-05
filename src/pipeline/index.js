import { clean } from "./clean.js";
import { guided } from "./guided.js";

import { MODES } from "../app/constants.js";

export async function runPipeline(files, config) {
  switch (config.mode) {
    case MODES.clean:
      await clean(files, config);
      break;
    case MODES.guided:
      await guided(files, config);
      break;
    default:
      throw new Error(`'${config.mode}' is not a valid mode`);
  }
}

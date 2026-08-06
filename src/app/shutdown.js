import { logger } from "../shared/logger.js";

class Shutdown {
  #critical = 0;
  #requested = false;

  constructor() {
    process.on("SIGINT", () => this.request());
  }

  request() {
    this.#requested = true;

    if (this.#critical > 0) {
      logger.info("Cancellation requested. Finishing current operation...");
      return;
    }

    this.exit();
  }

  async critical(fn) {
    this.#critical++;

    try {
      return await fn();
    } finally {
      this.#critical--;

      if (this.#requested && this.#critical === 0) {
        this.exit();
      }
    }
  }

  exit(code = 130) {
    console.log("\nAborted.");
    process.exit(code);
  }
}

export const shutdown = new Shutdown();

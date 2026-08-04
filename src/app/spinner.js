import ora from "ora";

class Spinner {
  #spinner = null;

  #checkStarted() {
    if (!this.#spinner) throw new Error("Spinner has not been started.");
  }

  start(text) {
    this.#spinner = ora({
      text,
      spinner: "dots",
      discardStdin: false,
    });

    this.#spinner.start();
  }

  step(text) {
    this.#checkStarted();
    this.#spinner.text = text;
  }

  success(text) {
    this.#checkStarted();
    this.#spinner.succeed(text);
  }

  fail(text) {
    this.#checkStarted();
    this.#spinner.fail(text);
  }

  stop() {
    this.#checkStarted();
    this.#spinner.stop();
  }

  async suspend(action) {
    this.#checkStarted();
    const text = this.#spinner.text;

    this.#spinner.stop();

    try {
      return await action();
    } finally {
      this.#spinner.start(text);
    }
  }
}

const spinner = new Spinner();

export { spinner };

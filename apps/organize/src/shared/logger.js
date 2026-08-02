import kleur from "kleur";

export const ui = {
  info: kleur.cyan,
  success: kleur.green,
  warning: kleur.yellow,
  error: kleur.red,

  title: kleur.bold,
  muted: kleur.dim,
};

export const logger = {
  info(message, ...args) {
    console.log(`${ui.info("ℹ")} ${message}`, ...args);
  },

  success(message, ...args) {
    console.log(`${ui.success("✓")} ${message}`, ...args);
  },

  warn(message, ...args) {
    console.warn(`${ui.warning("⚠")} ${message}`, ...args);
  },

  error(message, ...args) {
    console.error(`${ui.error("✕")} ${message}`, ...args);
  },

  title(message) {
    console.log(ui.title(message));
  },

  text(message) {
    console.log(message);
  },

  muted(message) {
    console.log(ui.muted(message));
  },

  divider() {
    console.log(ui.muted("────────────────────────────────────────────"));
  },
};

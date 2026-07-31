const SUPPORTED_EXTENSIONS = new Set([".mkv", ".mp4"]);

export const isMediaFile = (extension) =>
  SUPPORTED_EXTENSIONS.has(extension.toLowerCase());

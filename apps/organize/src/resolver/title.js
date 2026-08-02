import path from "node:path";
import {
  removeWebsitePrefix,
  normalizeSeparators,
  truncateReleaseInfo,
  cleanTitle,
  extractYear,
} from "./cleaners.js";

export async function resolveTitle(file) {
  const source = file.metadata.title || path.parse(file.name).name;

  const year = extractYear(source);

  let title = source;

  title = removeWebsitePrefix(title);
  title = normalizeSeparators(title);
  title = truncateReleaseInfo(title, year);
  title = cleanTitle(title);

  file.query = {
    title,
    year,
    source: file.metadata.title ? "metadata" : "filename",
  };
}

import path from "node:path";
import {
  removeWebsitePrefix,
  normalizeSeparators,
  truncateReleaseInfo,
  cleanTitle,
  extractYear,
} from "./cleaners.js";

export async function resolveTitle(file) {
  const title = file.metadata.title;
  const name = path.parse(file.name).name;

  const source = title || name;

  const year = extractYear(source) ?? extractYear(name);

  let resolved = source;

  resolved = removeWebsitePrefix(resolved);
  resolved = normalizeSeparators(resolved);
  resolved = truncateReleaseInfo(resolved, year);
  resolved = cleanTitle(resolved);

  file.query = {
    title: resolved,
    year,
  };
}

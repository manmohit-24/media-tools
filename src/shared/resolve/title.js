import path from "node:path";
import {
  removeWebsitePrefix,
  normalizeSeparators,
  truncateReleaseInfo,
  cleanTitle,
  extractYear,
} from "./cleaners.js";

export function resolveTitle(title, name) {
  const year = extractYear(title) ?? extractYear(name);

  let resolved = title ?? name;

  resolved = removeWebsitePrefix(resolved);
  resolved = normalizeSeparators(resolved);
  resolved = truncateReleaseInfo(resolved, year);
  resolved = cleanTitle(resolved);

  return {
    title: resolved,
    year,
  };
}

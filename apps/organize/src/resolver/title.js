import path from "node:path";

export async function resolveTitle(file) {
  const source = file.metadata.title || path.parse(file.name).name;
  const year = extractYear(source);

  file.query = {
    title: cleanTitle(source, year),
    year,
    source: file.metadata.title ? "metadata" : "filename",
  };
}

function extractYear(text) {
  const match = text.match(/\b(19|20)\d{2}\b/);

  return match ? Number(match[0]) : null;
}

function cleanTitle(text, year) {
  let title = text;

  if (year) title = title.replace(year.toString(), "");

  return title
    .replace(/[._]/g, " ")
    .replace(/\(\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

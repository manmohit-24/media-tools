import fs from "node:fs/promises";
import path from "node:path";

const SUPPORTED_EXTENSIONS = new Set([".mkv", ".mp4"]);

function isSupportedMedia(extension) {
  return SUPPORTED_EXTENSIONS.has(extension.toLowerCase());
}

export async function scan(input) {
  if (!input.path) throw new Error("Path is required.");

  const files = [];
  const stat = await fs.stat(input.path);

  if (stat.isFile()) {
    const extension = path.extname(input.path);

    if (!isSupportedMedia(extension))
      throw new Error("Not a supported media file.");

    files.push({
      path: input.path,
      name: path.basename(input.path),
      extension,
    });

    return files;
  }

  if (stat.isDirectory()) {
    await walkDirectory(input.path, files, input.options.recursive);
    return files;
  }

  throw new Error("Invalid path.");
}

async function walkDirectory(directory, files, recursive) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (recursive && entry.isDirectory()) {
      await walkDirectory(fullPath, files, true);
      continue;
    }

    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name);
    if (!isSupportedMedia(extension)) continue;

    files.push({
      path: fullPath,
      name: entry.name,
      extension,
    });
  }
}

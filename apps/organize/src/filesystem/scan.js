import fs from "node:fs/promises";
import path from "node:path";

import { isMediaFile } from "./media.js";

export async function scan(ctx) {
  if (!ctx.input) throw new Error("Input directory is required.");

  ctx.files = [];

  await walkDirectory(ctx.input, ctx.files, ctx.options.recursive);
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

    if (!isMediaFile(extension)) continue;

    files.push({
      path: fullPath,
      name: entry.name,
      extension,
    });
  }
}

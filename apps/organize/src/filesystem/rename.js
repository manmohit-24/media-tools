import path from "node:path";
import { rename } from "node:fs/promises";
import { access } from "node:fs/promises";

export async function renameFile(file) {
  const { destination, filename } = await getAvailablePath(
    path.dirname(file.path),
    `${file.movie.title} (${file.movie.year})`,
    path.extname(file.path),
  );

  if (destination === file.path) return;
  await rename(file.path, destination);

  file.path = destination;
  file.name = filename;
}

export async function getAvailablePath(dir, baseName, extension) {
  let filename = `${baseName}${extension}`;
  let destination = path.join(dir, filename);
  let index = 1;

  while (await exists(destination)) {
    filename = `${baseName} (${index})${extension}`;
    destination = path.join(dir, filename);
    index++;
  }

  return { destination, filename };
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

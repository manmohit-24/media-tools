import * as mkv from "./mkv.js";
import * as mp4 from "./mp4.js";

export async function updateMetadata(file) {
  switch (file.extension) {
    case ".mkv":
      return mkv.updateMetadata(file);

    case ".mp4":
      return mp4.updateMetadata(file);

    default:
      throw new Error(`Unsupported format: ${file.extension}`);
  }
}

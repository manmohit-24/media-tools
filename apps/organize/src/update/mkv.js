import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { execute } from "../shared/execute.js";
import { downloadPoster } from "../tmdb/poster.js";

export async function updateMetadata(file) {
  const args = buildEditArguments(file.standard);

  let temp = null;

  if (file.movie.poster) {
    const poster = await downloadPoster(file.movie.poster);
    temp = path.join(tmpdir(), "cover.jpg");

    await writeFile(temp, poster.data);
    addPoster(args, temp);
  }

  try {
    await execute("mkvpropedit", [file.path, ...args]);
  } catch (error) {
    if (error.code > 1) throw error; // mkvpropedit throws error code 1 for warnings
  } finally {
    if (temp) await unlink(temp);
  }
}

function buildEditArguments(metadata) {
  const args = [];

  addGeneralMetadata(args, metadata);
  addAudioTracks(args, metadata.audio);
  addSubtitleTracks(args, metadata.subtitles);
  removeAttachments(args);
  return args;
}

function addGeneralMetadata(args, metadata) {
  args.push("--edit", "info", "--set", `title=${metadata.title}`);
  args.push("--tags", "all:");
}

function addAudioTracks(args, tracks) {
  for (const track of tracks) {
    args.push("--edit", `track:${track.id}`, "--set", `name=${track.name}`);
  }
}

function addSubtitleTracks(args, tracks) {
  for (const track of tracks) {
    args.push("--edit", `track:${track.id}`, "--set", `name=${track.name}`);
  }
}

function removeAttachments(args) {
  args.push(
    "--delete-attachment",
    "mime-type:image/jpeg",
    "--delete-attachment",
    "mime-type:image/png",
  );
}

function addPoster(args, tempPath) {
  args.push(
    "--attachment-name",
    "cover.jpg",
    "--attachment-mime-type",
    "image/jpeg",
    "--add-attachment",
    tempPath,
  );
}

import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { execute } from "../shared/execute.js";
import { downloadPoster } from "../tmdb/poster.js";

export async function updateMetadata(file) {
  const standard = file.standard;
  const args = [];

  buildEditArguments(args, standard);
  let temp = null;

  if (standard.cover) {
    const { filename, source } = standard.cover;
    const poster = await downloadPoster(source);

    temp = path.join(tmpdir(), filename);

    await writeFile(temp, poster.data);
    addPoster(args, filename, temp);
  }

  try {
    await execute("mkvpropedit", [file.path, ...args]);
  } catch (error) {
    if (error.code > 1) throw error; // mkvpropedit throws error code 1 for warnings
  } finally {
    if (temp) await unlink(temp);
  }
}

function buildEditArguments(args, standard) {
  addGeneralMetadata(args, standard);
  addAudioTracks(args, standard.audio);
  addSubtitleTracks(args, standard.subtitles);
  removeAttachments(args);
}

function addGeneralMetadata(args, standard) {
  args.push("--edit", "info", "--set", `title=${standard.title}`);
  args.push("--tags", "all:");
  if (standard.release_date)
    args.push("--edit", "info", "--set", `date=${standard.release_date}`);
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

function addPoster(args, filename, tempPath) {
  args.push(
    "--attachment-name",
    filename ?? "cover.jpg",
    "--attachment-mime-type",
    "image/jpeg",
    "--add-attachment",
    tempPath,
  );
}

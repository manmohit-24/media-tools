import { utimes } from "node:fs/promises";
import { spinner } from "../../app/spinner.js";

export async function updateTimestamps(file) {
  spinner.step("Updating Timestamps");
  if (!file.standard.release_date) return;

  const date = new Date(`${file.standard.release_date}T00:00:00Z`);

  await utimes(file.path, date, date);
}

import { execute } from "../../shared/execute.js";

export async function readMetadata(file) {
  const { stdout } = await execute("mediainfo", ["--Output=JSON", file.path]);
  const mediaInfo = JSON.parse(stdout);
  file.metadata = extractMetadata(mediaInfo);
}

function extractMetadata(mediaInfo) {
  const tracks = mediaInfo.media.track;

  const general = tracks.find((track) => track["@type"] === "General");
  const video = tracks.find((track) => track["@type"] === "Video");
  const audio = tracks.filter((track) => track["@type"] === "Audio");
  const subtitles = tracks.filter((track) => track["@type"] === "Text");
  const cover = tracks.find(
    (track) => track["@type"] === "Image" && track.Type === "Cover",
  );

  return {
    title: general?.Title ?? null,
    cover: cover ? { name: cover.Title } : null,
    video: video
      ? {
          format: video.Format,
          width: Number(video.Width),
          height: Number(video.Height),
        }
      : null,

    audio: audio.map((track) => ({
      id: Number(track.ID),
      language: track.Language,
      title: track.Title ?? null,
      default: track.Default === "Yes",
      forced: track.Forced === "Yes",
    })),

    subtitles: subtitles.map((track) => ({
      id: Number(track.ID),
      language: track.Language,
      title: track.Title ?? null,
      default: track.Default === "Yes",
      forced: track.Forced === "Yes",
    })),
  };
}

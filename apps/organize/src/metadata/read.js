import { execute } from "../shared/execute.js";

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
    cover: cover
      ? {
          exists: true,
          name: cover.Title,
        }
      : {
          exists: false,
          name: null,
        },
    video: video
      ? {
          codec: video.Format,
          width: Number(video.Width),
          height: Number(video.Height),
        }
      : null,

    audio: audio.map((track) => ({
      language: track.Language ?? null,
      title: track.Title ?? null,
    })),

    subtitles: subtitles.map((track) => ({
      language: track.Language ?? null,
      title: track.Title ?? null,
    })),
  };
}

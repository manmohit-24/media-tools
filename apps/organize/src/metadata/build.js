import { getLanguageName } from "../shared/language.js";

export function addStandardMeta(file) {
  if (!file.movie) throw new Error(`No movie`);
  file.standard = {
    title: file.movie.title,
    comment: null,
    cover: {
      filename: "cover.jpg",
      source: file.movie.poster,
    },
    audio: file.metadata.audio.map(buildAudioTrack),
    subtitles: file.metadata.subtitles.map(buildSubtitleTrack),
  };
}

function buildAudioTrack(track) {
  const language = normalizeLanguage(track.language);
  return {
    id: track.id,
    language: language,
    name: track.title ?? getLanguageName(language),
    default: track.default,
    forced: track.forced,
  };
}

function buildSubtitleTrack(track) {
  const language = normalizeLanguage(track.language);
  return {
    id: track.id,
    language: language,
    name: buildSubtitleName(language, track),
    default: track.default,
    forced: track.forced,
  };
}

export function normalizeLanguage(code) {
  return code?.toLowerCase().split("-")[0].trim();
}
function buildSubtitleName(language, track) {
  const lang = getLanguageName(language);

  return `${lang} ${track.default ? "(Default) " : ""}${track.forced ? "(Forced)" : ""}`;

  return lang;
}

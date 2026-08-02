import { getLanguageName } from "../shared/language.js";

export function addStandardMeta(file) {
  if (!file.match) throw new Error(`No Movie found`);

  file.standard = {
    title: file.match.title,
    cover: {
      filename: "cover.jpg",
      source: file.match.poster,
    },
    audio: file.metadata.audio.map(buildAudioTrack),
    subtitles: file.metadata.subtitles.map(buildSubtitleTrack),
    release_date: file.match.release_date,
    name: `${file.match.title} (${file.match.release_date.slice(0, 4)})`,
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

function normalizeLanguage(code) {
  return code?.toLowerCase().split("-")[0].trim();
}

function buildSubtitleName(language, track) {
  const lang = getLanguageName(language);

  return `${lang} ${track.default ? "(Default) " : ""}${track.forced ? "(Forced)" : ""}`;

  return lang;
}

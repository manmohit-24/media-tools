export function getLanguageName(code) {
  const languages = {
    en: "English",
    hi: "Hindi",
    pa: "Punjabi",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    fr: "French",
    de: "German",
    es: "Spanish",
  };

  return languages[code] ?? code;
}

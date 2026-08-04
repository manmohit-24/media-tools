const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export async function downloadPoster(poster) {
  const url = `${IMAGE_BASE_URL}${poster}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to download poster.");

  return {
    data: Buffer.from(await response.arrayBuffer()),
    mime: response.headers.get("content-type"),
  };
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export async function downloadPoster(file) {
  if (!file.movie?.poster) return;

  const url = `${IMAGE_BASE_URL}${file.movie.poster}`;

  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to download poster.");

  file.poster = {
    data: Buffer.from(await response.arrayBuffer()),
    mime: response.headers.get("content-type"),
  };
}

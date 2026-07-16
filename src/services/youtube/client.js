import "server-only";

const SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";

export async function searchEducationalVideos(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is required to fetch YouTube resources.");

  const params = new URLSearchParams({ key: apiKey, part: "snippet", type: "video", maxResults: "3", q: `${query} tutorial`, safeSearch: "strict" });
  const response = await fetch(`${SEARCH_ENDPOINT}?${params.toString()}`, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error("YouTube could not return educational videos right now.");
  const payload = await response.json();
  return (payload.items || []).filter((item) => item.id?.videoId).map((item) => ({ type: "youtube", title: item.snippet.title, url: `https://www.youtube.com/watch?v=${item.id.videoId}`, description: item.snippet.description || "", thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "" }));
}

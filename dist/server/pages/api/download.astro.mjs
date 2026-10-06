import { exec } from 'child_process';
import { promisify } from 'util';
export { renderers } from '../../renderers.mjs';

const execPromise = promisify(exec);
function extractVideoId(urlStr) {
  const match = urlStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}
async function getStreamUrlFromYtDlp(url, isAudio) {
  try {
    const formatFlag = isAudio ? '-f "ba/best"' : '-f "b/best"';
    const { stdout } = await execPromise(`python -m yt_dlp --js-runtimes node ${formatFlag} -g "${url}"`);
    const lines = stdout.trim().split("\n").filter(Boolean);
    return lines[0] || null;
  } catch {
    return null;
  }
}
async function getStreamUrlFromInvidious(videoId, isAudio) {
  const instances = [
    "https://invidious.f5.si",
    "https://invidious.nerqv.ai",
    "https://vid.puffyan.us",
    "https://invidious.privacydev.net"
  ];
  for (const baseUrl of instances) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${baseUrl}/api/v1/videos/${videoId}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const title = data.title || "YouTube_Video";
        if (isAudio && data.adaptiveFormats) {
          const audio = data.adaptiveFormats.find((s) => s.type?.includes("audio") && s.url);
          if (audio) return { url: audio.url, title };
        }
        if (data.formatStreams) {
          const video = data.formatStreams.find((s) => s.url);
          if (video) return { url: video.url, title };
        }
        if (data.adaptiveFormats) {
          const video = data.adaptiveFormats.find((s) => s.type?.includes("video/mp4") && s.url);
          if (video) return { url: video.url, title };
        }
      }
    } catch {
    }
  }
  return null;
}
const GET = async ({ request }) => {
  const urlParams = new URL(request.url).searchParams;
  const inputUrl = urlParams.get("url") || urlParams.get("id");
  const format = (urlParams.get("format") || "mp4").toLowerCase();
  const isAudio = format === "mp3" || format === "m4a" || format === "audio";
  if (!inputUrl) {
    return new Response(JSON.stringify({ error: "Missing YouTube URL parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const videoId = extractVideoId(inputUrl) || inputUrl;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  let resolved = await getStreamUrlFromInvidious(videoId, isAudio);
  let streamUrl = resolved?.url;
  let rawTitle = resolved?.title || `youtube_${videoId}`;
  if (!streamUrl) {
    streamUrl = await getStreamUrlFromYtDlp(watchUrl, isAudio) || void 0;
  }
  if (!streamUrl) {
    const itag = isAudio ? "140" : "18";
    streamUrl = `https://invidious.f5.si/latest_version?id=${videoId}&itag=${itag}`;
  }
  const safeTitle = rawTitle.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "_");
  const ext = isAudio ? "mp3" : "mp4";
  const filename = `${safeTitle}.${ext}`;
  try {
    const mediaRes = await fetch(streamUrl);
    if (!mediaRes.ok && mediaRes.status !== 206) {
      return Response.redirect(streamUrl, 302);
    }
    const headers = new Headers();
    headers.set("Content-Type", isAudio ? "audio/mpeg" : "video/mp4");
    headers.set("Content-Disposition", `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    if (mediaRes.headers.get("content-length")) {
      headers.set("Content-Length", mediaRes.headers.get("content-length"));
    }
    return new Response(mediaRes.body, {
      status: 200,
      headers
    });
  } catch (e) {
    return Response.redirect(streamUrl, 302);
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = __dirname;
const DEFAULT_PORT = Number(process.env.PORT || 3002);
const DEFAULT_PLAYLIST_ID = "9582770241";
const QQ_API = "https://u.y.qq.com/cgi-bin/musicu.fcg";
const QQ_STREAM_BASE = "https://ws.stream.qqmusic.qq.com/";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav"
};

function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function getRequestBody(module, method, param) {
  return {
    comm: { ct: 24, cv: 0 },
    req_0: { module, method, param }
  };
}

async function qqRequest(module, method, param) {
  const response = await fetch(QQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0"
    },
    body: JSON.stringify(getRequestBody(module, method, param))
  });

  if (!response.ok) {
    throw new Error(`QQ Music request failed: ${response.status}`);
  }

  const payload = await response.json();
  const item = payload.req_0;
  if (!item || item.code !== 0) {
    throw new Error(`QQ Music returned code ${item && item.code}`);
  }
  return item.data;
}

async function getPlaylistSongs(playlistId) {
  const firstPage = await qqRequest("music.srfDissInfo.DissInfo", "CgiGetDiss", {
    disstid: Number(playlistId),
    dirid: 0,
    tag: 1,
    song_begin: 0,
    song_num: 1,
    userinfo: 1,
    orderlist: 1,
    onlysonglist: 0
  });

  const total = firstPage.dirinfo?.songnum || 236;
  const full = await qqRequest("music.srfDissInfo.DissInfo", "CgiGetDiss", {
    disstid: Number(playlistId),
    dirid: 0,
    tag: 1,
    song_begin: 0,
    song_num: total,
    userinfo: 1,
    orderlist: 1,
    onlysonglist: 0
  });

  return {
    playlist: {
      id: String(playlistId),
      title: full.dirinfo?.title || "QQ 音乐歌单",
      cover: full.dirinfo?.picurl || "",
      total: full.dirinfo?.songnum || full.songlist?.length || 0
    },
    songs: Array.isArray(full.songlist) ? full.songlist : []
  };
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toTrack(song, index) {
  const albumMid = song.album?.mid || "";
  const mediaMid = song.file?.media_mid || song.mid;
  const singers = Array.isArray(song.singer) ? song.singer.map((item) => item.name).filter(Boolean) : [];
  const palette = [
    ["from-sky-950 via-blue-900 to-black", "bg-sky-200"],
    ["from-rose-950 via-pink-900 to-black", "bg-rose-300"],
    ["from-violet-950 via-purple-900 to-black", "bg-violet-200"],
    ["from-amber-950 via-orange-900 to-black", "bg-amber-200"]
  ][index % 4];

  return {
    id: `qq-${song.id}`,
    title: song.album?.name || "QQ Music",
    year: (song.time_public || "").slice(0, 4) || "QQ",
    song: song.name || song.title || "未知歌曲",
    artist: singers.join("/") || "Unknown",
    source: "qq",
    qqSongId: String(song.id),
    qqSongMid: song.mid,
    qqMediaMid: mediaMid,
    qqSongType: 1,
    qqPlayerSongType: 0,
    qqMusicUrl: `https://i.y.qq.com/v8/playsong.html?songid=${song.id}&songtype=0`,
    cover: albumMid ? `https://y.qq.com/music/photo_new/T002R300x300M000${albumMid}.jpg` : "",
    gradient: palette[0],
    label: palette[1]
  };
}

async function attachPlayableUrls(tracks) {
  const filename = tracks.map((track) => `M500${track.qqMediaMid}.mp3`);
  const songmid = tracks.map((track) => track.qqSongMid);
  const songtype = tracks.map((track) => track.qqSongType || 0);

  const data = await qqRequest("music.vkey.GetVkey", "UrlGetVkey", {
    uin: "",
    filename,
    guid: `${Date.now()}${Math.floor(Math.random() * 100000)}`,
    songmid,
    songtype,
    ctx: 0
  });

  const infos = data.midurlinfo || [];
  return tracks.map((track, index) => {
    const purl = infos[index]?.purl || "";
    return purl
      ? { ...track, audioSrc: `${QQ_STREAM_BASE}${purl}`, playback: "direct" }
      : { ...track, playback: "iframe" };
  });
}

async function getRandomTracks(playlistId, count) {
  const { playlist, songs } = await getPlaylistSongs(playlistId);
  const candidates = shuffle(songs).map(toTrack);
  const direct = [];
  const fallback = [];

  for (let i = 0; i < candidates.length && direct.length < count; i += 8) {
    const batch = candidates.slice(i, i + 8);
    const withUrls = await attachPlayableUrls(batch);
    direct.push(...withUrls.filter((track) => track.audioSrc));
    fallback.push(...withUrls.filter((track) => !track.audioSrc));
  }

  const tracks = direct.slice(0, count);
  if (tracks.length < count) {
    tracks.push(...fallback.slice(0, count - tracks.length));
  }

  return { playlist, tracks };
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/qq-playlist-random") {
    const playlistId = url.searchParams.get("id") || DEFAULT_PLAYLIST_ID;
    const count = Math.max(1, Math.min(8, Number(url.searchParams.get("count") || 4)));
    jsonResponse(res, 200, await getRandomTracks(playlistId, count));
    return;
  }

  jsonResponse(res, 404, { error: "Unknown API route" });
}

async function handleStatic(req, res, url) {
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(ROOT, requested));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await handleStatic(req, res, url);
  } catch (error) {
    jsonResponse(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(DEFAULT_PORT, () => {
  console.log(`Apple Notes music server running at http://localhost:${DEFAULT_PORT}`);
});

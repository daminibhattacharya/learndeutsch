// Tiny German Quest backend: a zero-dependency Node server that
// serves the frontend pages and a small JSON API.
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_DIR = path.resolve(__dirname, "..", "frontend");

const LESSONS = [
  { id: "nominative", order: 1, title: "Nominative Adventure", page: "/nominative-adventure.html" },
  { id: "akkusativ", order: 2, title: "Akkusativ Adventure", page: "/akkusativ-study.html" },
];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

const routes = {
  "/api/health": () => ({ status: "ok" }),
  "/api/lessons": () => ({ lessons: LESSONS }),
};

async function serveStatic(pathname, res) {
  const relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname).replace(/^\/+/, "");
  const filePath = path.resolve(FRONTEND_DIR, relative);

  // Refuse anything that escapes the frontend folder (e.g. "/../backend/server.js").
  if (filePath !== FRONTEND_DIR && !filePath.startsWith(FRONTEND_DIR + path.sep)) {
    return sendJson(res, 403, { error: "Forbidden" });
  }

  try {
    const data = await fs.readFile(filePath);
    const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");

  if (pathname.startsWith("/api/")) {
    const handler = routes[pathname];
    if (!handler) return sendJson(res, 404, { error: "Not found" });
    if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
    return sendJson(res, 200, handler());
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }
  return serveStatic(pathname, res);
});

server.listen(PORT, () => {
  console.log(`Tiny German Quest running at http://localhost:${PORT}`);
});

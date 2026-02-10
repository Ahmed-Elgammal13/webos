export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    // If the path is "/" or ends with "/", serve index.html
    if (path === "/" || path.endsWith("/")) {
      path += "index.html";
    }

    // Remove leading slash
    path = path.replace(/^\//, "");

    // Try to fetch the file from R2
    const object = await env.STATIC_BUCKET.get(path);

    if (!object) {
      // SPA fallback: serve index.html
      const fallback = await env.STATIC_BUCKET.get("index.html");
      if (fallback) {
        return new Response(fallback.body, {
          headers: { "Content-Type": "text/html" },
        });
      }

      return new Response("Not found", { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        "Content-Type": getContentType(path),
      },
    });
  },
};

function getContentType(path) {
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".css")) return "text/css";
  if (path.endsWith(".json")) return "application/json";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
}

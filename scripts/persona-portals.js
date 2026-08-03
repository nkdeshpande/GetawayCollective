#!/usr/bin/env node

const http = require("http");

const upstream = { hostname: "127.0.0.1", port: 3000 };
const portals = [
  { port: 3001, label: "Member", landing: "/member-workspace-preview?view=home" },
  { port: 3002, label: "Admin", landing: "/office-workspace-preview?view=lifecycle" },
];

function openPortal({ port, label, landing }) {
  const server = http.createServer((request, response) => {
    const incoming = new URL(request.url || "/", `http://localhost:${port}`);
    if (incoming.pathname === "/") {
      response.writeHead(302, { location: landing });
      response.end();
      return;
    }
    const targetPath = `${incoming.pathname}${incoming.search}`;
    const headers = { ...request.headers, host: `localhost:${upstream.port}` };
    const proxy = http.request({ ...upstream, path: targetPath, method: request.method, headers }, (upstreamResponse) => {
      const outgoingHeaders = { ...upstreamResponse.headers };
      const location = outgoingHeaders.location;
      if (typeof location === "string") {
        outgoingHeaders.location = location.replace(`http://localhost:${upstream.port}`, `http://localhost:${port}`);
      }
      response.writeHead(upstreamResponse.statusCode || 502, outgoingHeaders);
      upstreamResponse.pipe(response);
    });
    proxy.on("error", () => {
      response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
      response.end("The primary GC application is not available on port 3000.");
    });
    request.pipe(proxy);
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`[persona-portals] ${label.padEnd(7)} http://localhost:${port} -> ${landing}`);
  });
  return server;
}

portals.map(openPortal);

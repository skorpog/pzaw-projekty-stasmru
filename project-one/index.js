import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const html = readFileSync("index.html");
const favicon = readFileSync("favicon.ico");

createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } else if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/vnd.microsoft.icon" });
    res.end(favicon);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
}).listen(8000, () => {
  console.log("Serwer działa na http://localhost:8000/");
});

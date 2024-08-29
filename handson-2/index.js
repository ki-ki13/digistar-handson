const http = require("http");
const url = require("url");

const server3 = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(parsedUrl));
});

const server2 = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain");
  if (req.url !== "/backend7") {
    res.end("Kamu siapa? kamu seperti jelly");
    return;
  }

  switch (req.method) {
    case "GET":
      res.end("Halo! Aku QQ");
      break;
    case "POST":
    case "PUT":
    case "DELETE":
      res.end(`Received a ${req.method} request\n`);
      break;
    default:
      res.statusCode = 405;
      res.end("unknown");
      break;
  }
});

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.end(body);
    });
  } else {
    res.statusCode = 405;
    res.end("Only POST method is allowed\n");
  }
});
server.listen(3000, () => {
  console.log("Server running at localhost:3000");
});

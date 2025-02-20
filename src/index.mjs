import { createServer } from "node:http";
import { createWallet, signTransaction } from "./blockchain/wallet.mjs";
import { createReadStream, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicFolder = join(__dirname, "public");

const PORT = 3001;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const server = createServer((req, res) => {
/*

  Nova Transação

*/  
  if (req.url === "/transaction" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        console.log(JSON.stringify(data, null, 2))
        const response = { message: "Dados recebidos" };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "JSON inválido" }));
      }
    });

    return;
  }

/**
    Aquivos staticos
*/  

  let filePath = join(publicFolder, req.url === "/" ? "index.html" : req.url);

  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Arquivo não encontrado");
    return;
  }

  const ext = extname(filePath);
  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
  });

  const fileStream = createReadStream(filePath);
  fileStream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`- [app] lisnening at http://localhost:${PORT}`);
});

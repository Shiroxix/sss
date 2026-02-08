import "dotenv/config";
import express from "express";
import axios from "axios";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // IP Detection Route - Protected with secret key
  app.get("/ip", async (req, res) => {
    try {
      const secretKey = req.query.key as string;
      const adminKey = process.env.ADMIN_IP_KEY || "";
      
      // Verify the secret key
      if (!adminKey || !secretKey || secretKey !== adminKey) {
        return res.status(403).send(`
          <html>
            <head>
              <title>Acesso Negado</title>
              <style>
                body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #1a1a1a; color: white; }
                .card { background: #2a2a2a; padding: 2rem; border-radius: 1rem; text-align: center; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Acesso Negado</h1>
                <p>Voce nao tem permissao para acessar esta pagina.</p>
              </div>
            </body>
          </html>
        `);
      }
      
      // Use a service that returns the caller's IP
      const response = await axios.get("https://api.ipify.org?format=json");
      const outboundIp = response.data.ip;
      
      res.send(`
        <html>
          <head>
            <title>Brawl Lookup Pro - IP Detector</title>
            <style>
              body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #1a1a1a; color: white; }
              .card { background: #2a2a2a; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.5); text-align: center; }
              .ip { font-size: 2.5rem; font-weight: bold; color: #facc15; margin: 1rem 0; }
              .btn { background: #facc15; color: black; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: bold; }
              .btn:hover { background: #eab308; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>IP de Saida do Servidor</h1>
              <p>Copie este IP e adicione ao seu token no portal da Supercell:</p>
              <div class="ip" id="ip-text">${outboundIp}</div>
              <button class="btn" onclick="navigator.clipboard.writeText('${outboundIp}'); alert('IP copiado!')">Copiar IP</button>
              <p style="margin-top: 1rem; font-size: 0.8rem; color: #888;">Este eh o IP que o Render esta usando para fazer requisicoes a API do Brawl Stars.</p>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      res.status(500).send("Erro ao detectar IP: " + (error as Error).message);
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

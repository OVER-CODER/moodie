import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine);
    }
  });

  next();
});

let initialized = false;

async function initializeApp() {
  if (initialized) return;
  initialized = true;

  try {
    console.log("Initializing app routes...");
    
    // Import and register routes from server
    const { registerRoutes } = await import("../server/routes.ts");
    const { serveStatic } = await import("../server/static.ts");
    
    await registerRoutes(httpServer, app);
    
    console.log("Routes registered successfully");

    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Internal Server Error:", err);

      if (res.headersSent) {
        return next(err);
      }

      return res.status(status).json({ message });
    });

    // Serve static files
    serveStatic(app);
    console.log("Static file serving configured");
  } catch (error) {
    console.error("Failed to initialize app:", error);
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  try {
    await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined 
    });
  }
}

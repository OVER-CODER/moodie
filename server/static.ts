import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In Vercel serverless, __dirname may not point to where the public files are
  // Try multiple possible locations
  const possiblePaths = [
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "../dist/public"),
    path.resolve(__dirname, "../public"),
    path.join(process.cwd(), "dist/public"),
    path.join(process.cwd(), "public"),
  ];
  
  let distPath: string | undefined;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      distPath = p;
      break;
    }
  }
  
  if (!distPath) {
    throw new Error(
      `Could not find the build directory. Tried: ${possiblePaths.join(", ")}`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath!, "index.html"));
  });
}

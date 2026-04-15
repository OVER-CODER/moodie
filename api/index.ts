import 'dotenv/config';
import express from "express";

const app = express();

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "MoodMirror API running" });
});

// Basic test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

export default app;

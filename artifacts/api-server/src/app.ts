import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "node:path";
import fs from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const SESSION_SECRET = process.env["SESSION_SECRET"];
if (!SESSION_SECRET) {
  logger.warn("SESSION_SECRET is not set — using insecure dev fallback");
}

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser(SESSION_SECRET || "sigma-dev-secret-do-not-use-in-prod"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Serve uploaded images
app.use(
  "/api/uploads",
  express.static(UPLOADS_DIR, {
    maxAge: "7d",
    fallthrough: true,
    setHeaders(res) {
      res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    },
  }),
);

app.use("/api", router);

export default app;

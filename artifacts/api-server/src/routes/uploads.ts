import { Router, type IRouter } from "express";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { requireAdmin } from "./admin";

export const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

const router: IRouter = Router();

const MAX_BYTES = 12 * 1024 * 1024;

router.post("/admin/upload", requireAdmin, async (req, res) => {
  const filename = typeof req.body?.filename === "string" ? req.body.filename : "image";
  const dataUrl = typeof req.body?.dataUrl === "string" ? req.body.dataUrl : "";

  const m = dataUrl.match(/^data:([a-zA-Z0-9.+/-]+);base64,(.+)$/);
  if (!m) {
    res.status(400).json({ message: "Invalid data URL" });
    return;
  }

  const mime = m[1].toLowerCase();
  if (!mime.startsWith("image/")) {
    res.status(400).json({ message: "Only image uploads are supported" });
    return;
  }

  const buf = Buffer.from(m[2], "base64");
  if (buf.length === 0) {
    res.status(400).json({ message: "Empty file" });
    return;
  }
  if (buf.length > MAX_BYTES) {
    res.status(413).json({ message: "Image too large (max 12 MB)" });
    return;
  }

  const fallbackExt = (mime.split("/")[1] || "bin").replace(/[^a-z0-9]/gi, "").slice(0, 6) || "img";
  const safe = filename.replace(/[^a-z0-9._-]/gi, "_").slice(0, 60) || "image";
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(safe);
  const stamp = crypto.randomBytes(8).toString("hex");
  const finalName = hasExt ? `${stamp}-${safe}` : `${stamp}-${safe}.${fallbackExt}`;

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, finalName), buf);

  res.json({ url: `/api/uploads/${finalName}`, bytes: buf.length });
});

export default router;

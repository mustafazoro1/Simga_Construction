import { Router, type IRouter } from "express";
import { db, siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "./admin";

const router: IRouter = Router();

const KEY_PATTERN = /^[a-zA-Z0-9._-]+$/;
const MAX_KEY_LEN = 256;
const MAX_VALUE_LEN = 20000;

router.get("/content", async (_req, res) => {
  const rows = await db
    .select({ key: siteContentTable.key, value: siteContentTable.value })
    .from(siteContentTable);
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  res.json(map);
});

router.put("/content/:key", requireAdmin, async (req, res) => {
  const key = req.params.key;
  if (!key || key.length > MAX_KEY_LEN || !KEY_PATTERN.test(key)) {
    res.status(400).json({ message: "Invalid key" });
    return;
  }
  const value = typeof req.body?.value === "string" ? req.body.value : null;
  if (value === null) {
    res.status(400).json({ message: "Body must contain a 'value' string" });
    return;
  }
  if (value.length > MAX_VALUE_LEN) {
    res.status(400).json({ message: "Value too long" });
    return;
  }

  const now = new Date();
  await db
    .insert(siteContentTable)
    .values({ key, value, updatedAt: now })
    .onConflictDoUpdate({
      target: siteContentTable.key,
      set: { value, updatedAt: now },
    });

  res.json({ ok: true, key, value });
});

router.delete("/content/:key", requireAdmin, async (req, res) => {
  const key = req.params.key;
  if (!key || key.length > MAX_KEY_LEN || !KEY_PATTERN.test(key)) {
    res.status(400).json({ message: "Invalid key" });
    return;
  }
  await db.delete(siteContentTable).where(eq(siteContentTable.key, key));
  res.json({ ok: true });
});

router.delete("/content", requireAdmin, async (_req, res) => {
  await db.delete(siteContentTable);
  res.json({ ok: true });
});

export default router;

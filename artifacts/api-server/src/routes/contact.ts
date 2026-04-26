import { Router, type IRouter } from "express";
import { SubmitContactFormBody } from "@workspace/api-zod";
import { db, contactSubmissionsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactFormBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(contactSubmissionsTable)
    .values(parsed.data)
    .returning({ id: contactSubmissionsTable.id });

  res.status(201).json({ id: row.id, success: true });
});

export default router;

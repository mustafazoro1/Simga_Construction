import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";

const ADMIN_PASSWORD = process.env["SIGMA_ADMIN_PASSWORD"] || "123095";
export const ADMIN_COOKIE = "sigma_admin";
const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password) {
    res.status(400).json({ ok: false, message: "Password required" });
    return;
  }
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ ok: false, message: "Incorrect password" });
    return;
  }
  res.cookie(ADMIN_COOKIE, "1", {
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: THIRTY_DAYS_MS,
    path: "/",
  });
  res.json({ ok: true });
});

router.post("/admin/logout", (_req, res) => {
  res.clearCookie(ADMIN_COOKIE, { path: "/" });
  res.json({ ok: true });
});

router.get("/admin/me", (req, res) => {
  const isAdmin = req.signedCookies?.[ADMIN_COOKIE] === "1";
  res.json({ isAdmin });
});

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.signedCookies?.[ADMIN_COOKIE] === "1") {
    next();
    return;
  }
  res.status(401).json({ ok: false, message: "Admin authentication required" });
}

export default router;

import { Router, type IRouter } from "express";
import { db, projectsTable, type InsertProject } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "./admin";

const SEED_PROJECTS: InsertProject[] = [
  {
    id: "p1-rohri",
    title: "Project for Lining of Rohri Canal RD 645+670 to RD 680+000",
    category: "Canal",
    status: "Completed",
    employer: "GoS — Irrigation Department",
    originalContractValue: "PKR 7,059,065,419",
    subcontractingAmount: "PKR 2,250,836,125",
    awarded: "13-Jan-2016",
    completed: "06-Nov-2016",
    scopeNote: "Subcontracting works from RD 645+670 to RD 656+670 (11 RDs).",
    hero: "/sigma/rohri.jpg",
    gallery: ["/sigma/rohri-2.jpeg", "/sigma/rohri-3.jpeg"],
    sortOrder: 0,
  },
  {
    id: "p2-kachhi-kc06c",
    title: "Kachhi Canal Project, Contract KC-06C",
    category: "Canal",
    status: "Completed",
    employer: "WAPDA",
    originalContractValue: "PKR 2,766,955,772",
    subcontractingAmount: "PKR 1,750,200,186",
    awarded: "05-Oct-2009",
    completed: "20-Nov-2010",
    scopeNote: "Construction of Distribution System (Earthwork, Lining and Structures) and remaining structures of Main Canal from RD 1005+000 to RD 1166+000. Subcontracting works RD 1015+000 to RD 1075+000 (60 RDs).",
    hero: "/sigma/kachhi-kc06c.jpg",
    gallery: ["/sigma/kachhi06c-2.jpg", "/sigma/kachhi06c-3.jpg"],
    sortOrder: 1,
  },
  {
    id: "p3-kachhi-kc04",
    title: "Kachhi Canal Project, Contract KC-04 (RD 106+000 to RD 531+400)",
    category: "Canal",
    status: "Completed",
    employer: "WAPDA",
    originalContractValue: "PKR 9,737,012,911",
    subcontractingAmount: "PKR 2,996,184,110",
    awarded: "02-Nov-2016",
    completed: "10-Sep-2017",
    hero: "/sigma/kachhi-kc04.jpg",
    gallery: ["/sigma/kachhi04-2.jpg"],
    sortOrder: 2,
  },
  {
    id: "p4-mithrao",
    title: "Rehabilitation of Mithrao Canal, Contract WSIP/B1/NC/03",
    category: "Canal",
    status: "Completed",
    employer: "Provincial Highway Division Sanghar, GoS",
    originalContractValue: "PKR 3,578,986,880",
    subcontractingAmount: "PKR 1,550,520,789",
    awarded: "20-Apr-2016",
    completed: "10-May-2017",
    hero: "/sigma/mithrao.jpeg",
    gallery: ["/sigma/mithrao-2.jpeg"],
    sortOrder: 3,
  },
  {
    id: "p5-jamrao",
    title: "Rehabilitation of Jamrao Canal (Old, Twin, West)",
    category: "Canal",
    status: "Completed",
    employer: "Executive Engineer, Sindh Irrigation & Drainage Authority, Jamrao Division, Mirpurkhas",
    originalContractValue: "PKR 9,653,855,819",
    subcontractingAmount: "PKR 3,010,189,120",
    awarded: "10-Dec-2012",
    completed: "08-Mar-2017",
    scopeNote: "Old (Mile 0–49), Twin (Mile 0–59), C.C. Lining of West (RD 0–300, Tall). Subcontracting works RD 000+00 to RD 130+000 (130 RDs).",
    hero: "/sigma/jamrao.jpg",
    gallery: ["/sigma/jamrao-2.jpg"],
    sortOrder: 4,
  },
  {
    id: "p6-basima-1",
    title: "Construction of 2-Lane Highway from Basima to Khuzdar, N-30 (106 KMs)",
    category: "Highway",
    status: "In Progress",
    employer: "National Highway Authority",
    originalContractValue: "PKR 11,749,280,000",
    subcontractingAmount: "PKR 2,300,500,000",
    awarded: "N/A",
    completed: "N/A",
    scopeNote: "Subcontracting works from KM 35+000 to KM 56+500.",
    hero: "/sigma/basima1.jpeg",
    gallery: ["/sigma/basima2.jpeg"],
    sortOrder: 5,
  },
  {
    id: "p7-basima-2",
    title: "Construction of 2-Lane Highway from Basima to Khuzdar, N-30 (106 KMs) — Section II",
    category: "Highway",
    status: "In Progress",
    employer: "National Highway Authority",
    originalContractValue: "N/A",
    subcontractingAmount: "N/A",
    awarded: "N/A",
    completed: "N/A",
    hero: "/sigma/basima2.jpeg",
    gallery: ["/sigma/basima1.jpeg"],
    sortOrder: 6,
  },
  {
    id: "p8-khairpur",
    title: "Package-6 Khairpur LOT-I: Rehabilitation of 9 Roads in District Khairpur",
    category: "Roads",
    status: "Upcoming",
    employer: "N/A",
    originalContractValue: "N/A",
    subcontractingAmount: "N/A",
    awarded: "N/A",
    completed: "N/A",
    scopeNote: "Reference: PK-P&D GOS-369618-CW-RFB",
    hero: "/sigma/header.jpg",
    gallery: [],
    sortOrder: 7,
  },
  {
    id: "p9-jacobabad",
    title: "Widening & Reconditioning of Jacobabad–Thull Road, Mile 11/4–23/0 (18.51 KMs)",
    category: "Reconditioning",
    status: "Upcoming",
    employer: "N/A",
    originalContractValue: "N/A",
    subcontractingAmount: "N/A",
    awarded: "N/A",
    completed: "N/A",
    hero: "/sigma/header.jpg",
    gallery: [],
    sortOrder: 8,
  },
];

let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  const existing = await db.select({ id: projectsTable.id }).from(projectsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(projectsTable).values(SEED_PROJECTS);
  }
  seeded = true;
}

const ALLOWED_STATUS = new Set(["Completed", "In Progress", "Upcoming"]);

function normalizeProject(input: unknown): Partial<InsertProject> | null {
  if (!input || typeof input !== "object") return null;
  const b = input as Record<string, unknown>;
  const out: Partial<InsertProject> = {};
  if (typeof b.title === "string") out.title = b.title.slice(0, 500);
  if (typeof b.category === "string") out.category = b.category.slice(0, 80);
  if (typeof b.status === "string" && ALLOWED_STATUS.has(b.status)) out.status = b.status;
  if (typeof b.employer === "string") out.employer = b.employer.slice(0, 500);
  if (typeof b.originalContractValue === "string") out.originalContractValue = b.originalContractValue.slice(0, 200);
  if (typeof b.subcontractingAmount === "string") out.subcontractingAmount = b.subcontractingAmount.slice(0, 200);
  if (typeof b.awarded === "string") out.awarded = b.awarded.slice(0, 80);
  if (typeof b.completed === "string") out.completed = b.completed.slice(0, 80);
  if (typeof b.scopeNote === "string") out.scopeNote = b.scopeNote.slice(0, 8000);
  if (b.scopeNote === null) out.scopeNote = null;
  if (typeof b.hero === "string") out.hero = b.hero.slice(0, 2000);
  if (Array.isArray(b.gallery)) {
    out.gallery = (b.gallery as unknown[]).filter((s): s is string => typeof s === "string").slice(0, 30);
  }
  if (typeof b.sortOrder === "number" && Number.isFinite(b.sortOrder)) out.sortOrder = Math.floor(b.sortOrder);
  return out;
}

const router: IRouter = Router();

router.get("/projects", async (_req, res) => {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.createdAt));
  res.json(rows);
});

router.post("/projects", requireAdmin, async (req, res) => {
  const data = normalizeProject(req.body);
  if (!data || !data.title) {
    res.status(400).json({ message: "title is required" });
    return;
  }
  const reqId = typeof req.body?.id === "string" ? req.body.id : "";
  const cleanId = reqId.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 64);
  const id = cleanId || `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Place new project at end by default
  const maxSort = await db.select({ s: projectsTable.sortOrder }).from(projectsTable);
  const next = maxSort.reduce((m, r) => Math.max(m, r.s), -1) + 1;

  const insertVals: InsertProject = {
    id,
    title: data.title,
    category: data.category ?? "Other",
    status: data.status ?? "Upcoming",
    employer: data.employer ?? "N/A",
    originalContractValue: data.originalContractValue ?? "N/A",
    subcontractingAmount: data.subcontractingAmount ?? "N/A",
    awarded: data.awarded ?? "N/A",
    completed: data.completed ?? "N/A",
    scopeNote: data.scopeNote ?? null,
    hero: data.hero ?? "",
    gallery: data.gallery ?? [],
    sortOrder: data.sortOrder ?? next,
  };

  const [row] = await db.insert(projectsTable).values(insertVals).returning();
  res.status(201).json(row);
});

router.put("/projects/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const data = normalizeProject(req.body);
  if (!data) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(projectsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projectsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.json(row);
});

router.delete("/projects/:id", requireAdmin, async (req, res) => {
  await db.delete(projectsTable).where(eq(projectsTable.id, req.params.id));
  res.json({ ok: true });
});

export default router;

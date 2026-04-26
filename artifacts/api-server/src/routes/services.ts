import { Router, type IRouter } from "express";
import { db, servicesTable, type InsertService } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "./admin";

const SEED_SERVICES: InsertService[] = [
  {
    id: "roads-highways",
    title: "Roads & Highways",
    description:
      "Construction, widening and reconditioning of national and provincial highways, including N-30 and district road rehabilitation packages.",
    longDescription:
      "Sigma's roads & highways division delivers complete carriageway works — from earthwork and sub-base to bituminous and rigid pavement — to NHA and provincial standards. Our crews are mobilized across remote, high-temperature corridors and have executed multi-kilometer sections on the N-30 Basima–Khuzdar highway and rehabilitation packages in Khairpur and Jacobabad. Every job is run with surveyed control, calibrated equipment and on-site QC labs to keep ride quality and density on spec.",
    image: "/sigma/basima1.jpeg",
    whyBest: [
      "Decades of NHA-approved highway construction experience",
      "Modern paving, milling and compaction fleet kept on-call",
      "Full in-house survey and quality-control engineering team",
      "Proven on-time delivery on N-30 and district road rehab packages",
    ],
    icon: "Truck",
    sortOrder: 0,
  },
  {
    id: "canal-irrigation",
    title: "Canal Lining & Irrigation",
    description:
      "Concrete lining, earthwork, structures and rehabilitation of large irrigation canals across Sindh and Balochistan.",
    longDescription:
      "Canals are Sigma's signature work — over 200 RDs of lining executed across Rohri, Kachhi, Mithrao and Jamrao systems, totalling more than PKR 11 billion in subcontracted value. We handle the full scope: dewatering, slope dressing, blinding, CC lining with proper joint detailing, distribution structures, head regulators and rehabilitation of legacy systems. Our crews are practiced in maintaining hydraulic profiles and finishing tolerances at scale and in tight cropping calendars.",
    image: "/sigma/rohri.jpg",
    whyBest: [
      "200+ RDs of canal lining delivered for WAPDA, SIDA and GoS",
      "Specialist concrete teams trained for slope and joint quality",
      "Experienced with hydraulic structures and dewatering at scale",
      "Trusted subcontractor on Rohri, Kachhi, Mithrao and Jamrao canals",
    ],
    icon: "Waves",
    sortOrder: 1,
  },
  {
    id: "bridges-structures",
    title: "Bridges & Structures",
    description:
      "Reinforced concrete bridges, cross-drainage works, head-regulators and ancillary canal structures built to WAPDA and NHA specifications.",
    longDescription:
      "From cross-drainage culverts to multi-span reinforced concrete bridges, our structures division builds to WAPDA and NHA specifications with rigorous formwork control, certified rebar fixing and on-site batching where required. Sigma's structural crews work alongside our canal and roadworks teams so that bridges, head-regulators and ancillary structures are delivered without slowing the parent project's schedule.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Bridge crews trained on WAPDA / NHA specifications",
      "On-site batching and tight formwork control on every pour",
      "Integrated with our roads & canals teams for seamless interfaces",
      "Track record on head-regulators and cross-drainage works",
    ],
    icon: "Bridge",
    sortOrder: 2,
  },
  {
    id: "water-supply",
    title: "Water Supply Networks",
    description:
      "End-to-end water supply network construction with a focus on durability, hydraulic performance and community impact.",
    longDescription:
      "Sigma builds water supply networks that last — from intake structures and trunk mains to distribution lines, valves and chambers. We handle pipe-laying in DI, MS and HDPE, along with thrust blocks, hydrostatic testing, chlorination and commissioning. Each scheme is delivered with a community impact lens so households see clean, pressurized water from day one.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Experience with DI, MS and HDPE pipe networks at municipal scale",
      "In-house hydrostatic testing and disinfection capability",
      "Community-impact mindset on every commissioning",
      "Coordinated civil + mechanical crews for chambers and valves",
    ],
    icon: "Droplets",
    sortOrder: 3,
  },
  {
    id: "dams-barrages",
    title: "Dams & Barrages",
    description:
      "Heavy civil works for barrages, regulators and dam-related infrastructure executed with modern equipment and trained crews.",
    longDescription:
      "Heavy civil works are where Sigma's plant and equipment fleet shows its value. We mobilize excavators, dump trucks, batching plants and pumps to execute earthworks, structural concrete and ancillary works for barrages, regulators and dam-related infrastructure. Our project managers are veterans of WAPDA-grade scopes and run weekly QC, safety and progress reviews directly with the client engineer.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Owned heavy plant fleet ready for remote mobilization",
      "Senior project managers with WAPDA / large-canal background",
      "Weekly QC, safety and progress cadence with client engineers",
      "Strong HSE record on long-duration heavy-civil scopes",
    ],
    icon: "Mountain",
    sortOrder: 4,
  },
  {
    id: "civil-turnkey",
    title: "Civil Engineering & Turnkey Construction",
    description:
      "Residential, commercial and industrial turnkey works delivered with experienced engineers and rigorous quality assurance.",
    longDescription:
      "Sigma's turnkey arm handles the full lifecycle of residential, commercial and industrial buildings — design coordination, structural and architectural works, MEP, finishes and handover. Each project is led by a dedicated PM, supported by experienced engineers and a defined QA/QC checklist so the client can move in or operate from day one without snag chaos.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Single point of accountability from design to handover",
      "Experienced engineers across structural, architectural and MEP",
      "Defined QA/QC checklists so handover is genuinely turnkey",
      "Comfortable with residential, commercial and industrial scopes",
    ],
    icon: "HardHat",
    sortOrder: 5,
  },
];

let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  const existing = await db.select({ id: servicesTable.id }).from(servicesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(servicesTable).values(SEED_SERVICES);
  }
  seeded = true;
}

const ALLOWED_ICONS = new Set([
  "Truck", "Waves", "Bridge", "Droplets", "Mountain", "HardHat",
]);

function normalizeService(input: unknown): Partial<InsertService> | null {
  if (!input || typeof input !== "object") return null;
  const b = input as Record<string, unknown>;
  const out: Partial<InsertService> = {};
  if (typeof b.title === "string") out.title = b.title.slice(0, 200);
  if (typeof b.description === "string") out.description = b.description.slice(0, 2000);
  if (typeof b.longDescription === "string") out.longDescription = b.longDescription.slice(0, 8000);
  if (typeof b.image === "string") out.image = b.image.slice(0, 2000);
  if (typeof b.icon === "string") {
    out.icon = ALLOWED_ICONS.has(b.icon) ? b.icon : "HardHat";
  }
  if (Array.isArray(b.whyBest)) {
    out.whyBest = (b.whyBest as unknown[])
      .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      .map((s) => s.slice(0, 300))
      .slice(0, 12);
  }
  if (typeof b.sortOrder === "number" && Number.isFinite(b.sortOrder)) {
    out.sortOrder = Math.floor(b.sortOrder);
  }
  return out;
}

const router: IRouter = Router();

router.get("/services", async (_req, res) => {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.sortOrder), asc(servicesTable.createdAt));
  res.json(rows);
});

router.post("/services", requireAdmin, async (req, res) => {
  const data = normalizeService(req.body);
  if (!data || !data.title) {
    res.status(400).json({ message: "title is required" });
    return;
  }
  const reqId = typeof req.body?.id === "string" ? req.body.id : "";
  const cleanId = reqId.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 64);
  const id = cleanId || `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const maxSort = await db.select({ s: servicesTable.sortOrder }).from(servicesTable);
  const next = maxSort.reduce((m, r) => Math.max(m, r.s), -1) + 1;

  const insertVals: InsertService = {
    id,
    title: data.title,
    description: data.description ?? "",
    longDescription: data.longDescription ?? "",
    image: data.image ?? "",
    whyBest: data.whyBest ?? [],
    icon: data.icon ?? "HardHat",
    sortOrder: data.sortOrder ?? next,
  };

  const [row] = await db.insert(servicesTable).values(insertVals).returning();
  res.status(201).json(row);
});

router.put("/services/:id", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const data = normalizeService(req.body);
  if (!data) {
    res.status(400).json({ message: "Invalid body" });
    return;
  }
  const [row] = await db
    .update(servicesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(servicesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ message: "Service not found" });
    return;
  }
  res.json(row);
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  await db.delete(servicesTable).where(eq(servicesTable.id, req.params.id));
  res.json({ ok: true });
});

export default router;

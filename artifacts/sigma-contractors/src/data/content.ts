export const CONTACT_INFO = {
  email: "sigmacontractors1@gmail.com",
  phone: "+92 21 35300110",
  address: "Banglow No. 19/A/I, Street No. 10, Khayaban-e-Shamsher, Phase V, DHA, Karachi, Pakistan",
  city: "Karachi, Pakistan",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.5791244095415!2d67.0543!3d24.8105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQ4JzM3LjgiTiA2N8KwMDMnMTUuNSJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
};

export const HERO_TAGLINES = [
  {
    title: "Building Dreams, Engineering Excellence",
    sub: "From concept to completion, we deliver innovative construction solutions with precision and quality. Your vision, our expertise."
  },
  {
    title: "Engineering Excellence in Every Project",
    sub: "From highways and canal systems to water supply networks and barrages, our team combines technical precision with modern equipment to create infrastructure that supports economic growth and community development."
  },
  {
    title: "Strong Foundations. Sustainable Future",
    sub: "We specialize in roads, bridges, buildings, irrigation, and dam construction—executing complex projects with efficiency, compliance, and a commitment to quality, safety, and environmental responsibility."
  }
];

export const SERVICES_MARQUEE = [
  "Roads & Highways",
  "Canal Lining & Irrigation",
  "Bridges & Structures",
  "Water Supply Networks",
  "Dams & Barrages",
  "Civil Engineering",
  "Earthworks",
  "Turnkey Construction"
];

export const STATS = [
  { label: "Major Projects Delivered", value: "9+" },
  { label: "Years of Combined Experience", value: "30+" },
  { label: "Total Subcontract Value Executed", value: "PKR 14B+" },
  { label: "Client-Centered Approach", value: "100%" }
];

export const VISION_MISSION_GOAL = {
  vision: "To become a leading engineering and construction company recognized for innovation, reliability, and commitment to excellence in the industry.",
  mission: "To provide high-quality construction and engineering services that exceed client expectations while maintaining safety, sustainability, and efficiency in every project we undertake.",
  goal: "To execute every project on time and within budget while maintaining the highest standards of engineering integrity, environmental responsibility and structural safety."
};

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  whyBest: string[];
  icon: string;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "roads-highways",
    title: "Roads & Highways",
    description: "Construction, widening and reconditioning of national and provincial highways, including N-30 and district road rehabilitation packages.",
    longDescription:
      "Sigma's roads & highways division delivers complete carriageway works — from earthwork and sub-base to bituminous and rigid pavement — to NHA and provincial standards. Our crews are mobilized across remote, high-temperature corridors and have executed multi-kilometer sections on the N-30 Basima–Khuzdar highway and rehabilitation packages in Khairpur and Jacobabad. Every job is run with surveyed control, calibrated equipment and on-site QC labs to keep ride quality and density on spec.",
    image: "/sigma/basima1.jpeg",
    whyBest: [
      "Decades of NHA-approved highway construction experience",
      "Modern paving, milling and compaction fleet kept on-call",
      "Full in-house survey and quality-control engineering team",
      "Proven on-time delivery on N-30 and district road rehab packages"
    ],
    icon: "Truck"
  },
  {
    id: "canal-irrigation",
    title: "Canal Lining & Irrigation",
    description: "Concrete lining, earthwork, structures and rehabilitation of large irrigation canals across Sindh and Balochistan.",
    longDescription:
      "Canals are Sigma's signature work — over 200 RDs of lining executed across Rohri, Kachhi, Mithrao and Jamrao systems, totalling more than PKR 11 billion in subcontracted value. We handle the full scope: dewatering, slope dressing, blinding, CC lining with proper joint detailing, distribution structures, head regulators and rehabilitation of legacy systems. Our crews are practiced in maintaining hydraulic profiles and finishing tolerances at scale and in tight cropping calendars.",
    image: "/sigma/rohri.jpg",
    whyBest: [
      "200+ RDs of canal lining delivered for WAPDA, SIDA and GoS",
      "Specialist concrete teams trained for slope and joint quality",
      "Experienced with hydraulic structures and dewatering at scale",
      "Trusted subcontractor on Rohri, Kachhi, Mithrao and Jamrao canals"
    ],
    icon: "Waves"
  },
  {
    id: "bridges-structures",
    title: "Bridges & Structures",
    description: "Reinforced concrete bridges, cross-drainage works, head-regulators and ancillary canal structures built to WAPDA and NHA specifications.",
    longDescription:
      "From cross-drainage culverts to multi-span reinforced concrete bridges, our structures division builds to WAPDA and NHA specifications with rigorous formwork control, certified rebar fixing and on-site batching where required. Sigma's structural crews work alongside our canal and roadworks teams so that bridges, head-regulators and ancillary structures are delivered without slowing the parent project's schedule.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Bridge crews trained on WAPDA / NHA specifications",
      "On-site batching and tight formwork control on every pour",
      "Integrated with our roads & canals teams for seamless interfaces",
      "Track record on head-regulators and cross-drainage works"
    ],
    icon: "Bridge"
  },
  {
    id: "water-supply",
    title: "Water Supply Networks",
    description: "End-to-end water supply network construction with a focus on durability, hydraulic performance and community impact.",
    longDescription:
      "Sigma builds water supply networks that last — from intake structures and trunk mains to distribution lines, valves and chambers. We handle pipe-laying in DI, MS and HDPE, along with thrust blocks, hydrostatic testing, chlorination and commissioning. Each scheme is delivered with a community impact lens so households see clean, pressurized water from day one.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Experience with DI, MS and HDPE pipe networks at municipal scale",
      "In-house hydrostatic testing and disinfection capability",
      "Community-impact mindset on every commissioning",
      "Coordinated civil + mechanical crews for chambers and valves"
    ],
    icon: "Droplets"
  },
  {
    id: "dams-barrages",
    title: "Dams & Barrages",
    description: "Heavy civil works for barrages, regulators and dam-related infrastructure executed with modern equipment and trained crews.",
    longDescription:
      "Heavy civil works are where Sigma's plant and equipment fleet shows its value. We mobilize excavators, dump trucks, batching plants and pumps to execute earthworks, structural concrete and ancillary works for barrages, regulators and dam-related infrastructure. Our project managers are veterans of WAPDA-grade scopes and run weekly QC, safety and progress reviews directly with the client engineer.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Owned heavy plant fleet ready for remote mobilization",
      "Senior project managers with WAPDA / large-canal background",
      "Weekly QC, safety and progress cadence with client engineers",
      "Strong HSE record on long-duration heavy-civil scopes"
    ],
    icon: "Mountain"
  },
  {
    id: "civil-turnkey",
    title: "Civil Engineering & Turnkey Construction",
    description: "Residential, commercial and industrial turnkey works delivered with experienced engineers and rigorous quality assurance.",
    longDescription:
      "Sigma's turnkey arm handles the full lifecycle of residential, commercial and industrial buildings — design coordination, structural and architectural works, MEP, finishes and handover. Each project is led by a dedicated PM, supported by experienced engineers and a defined QA/QC checklist so the client can move in or operate from day one without snag chaos.",
    image: "/sigma/header.jpg",
    whyBest: [
      "Single point of accountability from design to handover",
      "Experienced engineers across structural, architectural and MEP",
      "Defined QA/QC checklists so handover is genuinely turnkey",
      "Comfortable with residential, commercial and industrial scopes"
    ],
    icon: "HardHat"
  }
];

export type ProjectStatus = "Completed" | "In Progress" | "Upcoming";

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  status: ProjectStatus;
  employer: string;
  originalContractValue: string;
  subcontractingAmount: string;
  awarded: string;
  completed: string;
  scopeNote?: string | null;
  hero: string;
  gallery: string[];
}

// Kept as a fallback for offline/SSR; the live data is fetched from /api/projects.
export const PROJECTS: ProjectItem[] = [];

"""Initial seed data for projects and services.

Ported verbatim from the original Express handlers so first-time GETs of
``/api/projects`` and ``/api/services`` produce the same rows on an empty DB.
"""

from __future__ import annotations

from typing import List

from .models import Project, Service


def build_seed_projects() -> List[Project]:
    rows = [
        dict(
            id="p1-rohri",
            title="Project for Lining of Rohri Canal RD 645+670 to RD 680+000",
            category="Canal",
            status="Completed",
            employer="GoS — Irrigation Department",
            original_contract_value="PKR 7,059,065,419",
            subcontracting_amount="PKR 2,250,836,125",
            awarded="13-Jan-2016",
            completed="06-Nov-2016",
            scope_note="Subcontracting works from RD 645+670 to RD 656+670 (11 RDs).",
            hero="/sigma/rohri.jpg",
            gallery=["/sigma/rohri-2.jpeg", "/sigma/rohri-3.jpeg"],
            sort_order=0,
        ),
        dict(
            id="p2-kachhi-kc06c",
            title="Kachhi Canal Project, Contract KC-06C",
            category="Canal",
            status="Completed",
            employer="WAPDA",
            original_contract_value="PKR 2,766,955,772",
            subcontracting_amount="PKR 1,750,200,186",
            awarded="05-Oct-2009",
            completed="20-Nov-2010",
            scope_note=(
                "Construction of Distribution System (Earthwork, Lining and "
                "Structures) and remaining structures of Main Canal from "
                "RD 1005+000 to RD 1166+000. Subcontracting works "
                "RD 1015+000 to RD 1075+000 (60 RDs)."
            ),
            hero="/sigma/kachhi-kc06c.jpg",
            gallery=["/sigma/kachhi06c-2.jpg", "/sigma/kachhi06c-3.jpg"],
            sort_order=1,
        ),
        dict(
            id="p3-kachhi-kc04",
            title="Kachhi Canal Project, Contract KC-04 (RD 106+000 to RD 531+400)",
            category="Canal",
            status="Completed",
            employer="WAPDA",
            original_contract_value="PKR 9,737,012,911",
            subcontracting_amount="PKR 2,996,184,110",
            awarded="02-Nov-2016",
            completed="10-Sep-2017",
            scope_note=None,
            hero="/sigma/kachhi-kc04.jpg",
            gallery=["/sigma/kachhi04-2.jpg"],
            sort_order=2,
        ),
        dict(
            id="p4-mithrao",
            title="Rehabilitation of Mithrao Canal, Contract WSIP/B1/NC/03",
            category="Canal",
            status="Completed",
            employer="Provincial Highway Division Sanghar, GoS",
            original_contract_value="PKR 3,578,986,880",
            subcontracting_amount="PKR 1,550,520,789",
            awarded="20-Apr-2016",
            completed="10-May-2017",
            scope_note=None,
            hero="/sigma/mithrao.jpeg",
            gallery=["/sigma/mithrao-2.jpeg"],
            sort_order=3,
        ),
        dict(
            id="p5-jamrao",
            title="Rehabilitation of Jamrao Canal (Old, Twin, West)",
            category="Canal",
            status="Completed",
            employer=(
                "Executive Engineer, Sindh Irrigation & Drainage Authority, "
                "Jamrao Division, Mirpurkhas"
            ),
            original_contract_value="PKR 9,653,855,819",
            subcontracting_amount="PKR 3,010,189,120",
            awarded="10-Dec-2012",
            completed="08-Mar-2017",
            scope_note=(
                "Old (Mile 0–49), Twin (Mile 0–59), C.C. Lining of West "
                "(RD 0–300, Tall). Subcontracting works RD 000+00 to "
                "RD 130+000 (130 RDs)."
            ),
            hero="/sigma/jamrao.jpg",
            gallery=["/sigma/jamrao-2.jpg"],
            sort_order=4,
        ),
        dict(
            id="p6-basima-1",
            title="Construction of 2-Lane Highway from Basima to Khuzdar, N-30 (106 KMs)",
            category="Highway",
            status="In Progress",
            employer="National Highway Authority",
            original_contract_value="PKR 11,749,280,000",
            subcontracting_amount="PKR 2,300,500,000",
            awarded="N/A",
            completed="N/A",
            scope_note="Subcontracting works from KM 35+000 to KM 56+500.",
            hero="/sigma/basima1.jpeg",
            gallery=["/sigma/basima2.jpeg"],
            sort_order=5,
        ),
        dict(
            id="p7-basima-2",
            title="Construction of 2-Lane Highway from Basima to Khuzdar, N-30 (106 KMs) — Section II",
            category="Highway",
            status="In Progress",
            employer="National Highway Authority",
            original_contract_value="N/A",
            subcontracting_amount="N/A",
            awarded="N/A",
            completed="N/A",
            scope_note=None,
            hero="/sigma/basima2.jpeg",
            gallery=["/sigma/basima1.jpeg"],
            sort_order=6,
        ),
        dict(
            id="p8-khairpur",
            title="Package-6 Khairpur LOT-I: Rehabilitation of 9 Roads in District Khairpur",
            category="Roads",
            status="Upcoming",
            employer="N/A",
            original_contract_value="N/A",
            subcontracting_amount="N/A",
            awarded="N/A",
            completed="N/A",
            scope_note="Reference: PK-P&D GOS-369618-CW-RFB",
            hero="/sigma/header.jpg",
            gallery=[],
            sort_order=7,
        ),
        dict(
            id="p9-jacobabad",
            title="Widening & Reconditioning of Jacobabad–Thull Road, Mile 11/4–23/0 (18.51 KMs)",
            category="Reconditioning",
            status="Upcoming",
            employer="N/A",
            original_contract_value="N/A",
            subcontracting_amount="N/A",
            awarded="N/A",
            completed="N/A",
            scope_note=None,
            hero="/sigma/header.jpg",
            gallery=[],
            sort_order=8,
        ),
    ]
    return [Project(**r) for r in rows]


def build_seed_services() -> List[Service]:
    rows = [
        dict(
            id="roads-highways",
            title="Roads & Highways",
            description=(
                "Construction, widening and reconditioning of national and "
                "provincial highways, including N-30 and district road "
                "rehabilitation packages."
            ),
            long_description=(
                "Sigma's roads & highways division delivers complete carriageway "
                "works — from earthwork and sub-base to bituminous and rigid "
                "pavement — to NHA and provincial standards. Our crews are "
                "mobilized across remote, high-temperature corridors and have "
                "executed multi-kilometer sections on the N-30 Basima–Khuzdar "
                "highway and rehabilitation packages in Khairpur and Jacobabad. "
                "Every job is run with surveyed control, calibrated equipment "
                "and on-site QC labs to keep ride quality and density on spec."
            ),
            image="/sigma/basima1.jpeg",
            why_best=[
                "Decades of NHA-approved highway construction experience",
                "Modern paving, milling and compaction fleet kept on-call",
                "Full in-house survey and quality-control engineering team",
                "Proven on-time delivery on N-30 and district road rehab packages",
            ],
            icon="Truck",
            sort_order=0,
        ),
        dict(
            id="canal-irrigation",
            title="Canal Lining & Irrigation",
            description=(
                "Concrete lining, earthwork, structures and rehabilitation of "
                "large irrigation canals across Sindh and Balochistan."
            ),
            long_description=(
                "Canals are Sigma's signature work — over 200 RDs of lining "
                "executed across Rohri, Kachhi, Mithrao and Jamrao systems, "
                "totalling more than PKR 11 billion in subcontracted value. "
                "We handle the full scope: dewatering, slope dressing, "
                "blinding, CC lining with proper joint detailing, distribution "
                "structures, head regulators and rehabilitation of legacy "
                "systems. Our crews are practiced in maintaining hydraulic "
                "profiles and finishing tolerances at scale and in tight "
                "cropping calendars."
            ),
            image="/sigma/rohri.jpg",
            why_best=[
                "200+ RDs of canal lining delivered for WAPDA, SIDA and GoS",
                "Specialist concrete teams trained for slope and joint quality",
                "Experienced with hydraulic structures and dewatering at scale",
                "Trusted subcontractor on Rohri, Kachhi, Mithrao and Jamrao canals",
            ],
            icon="Waves",
            sort_order=1,
        ),
        dict(
            id="bridges-structures",
            title="Bridges & Structures",
            description=(
                "Reinforced concrete bridges, cross-drainage works, "
                "head-regulators and ancillary canal structures built to "
                "WAPDA and NHA specifications."
            ),
            long_description=(
                "From cross-drainage culverts to multi-span reinforced "
                "concrete bridges, our structures division builds to WAPDA "
                "and NHA specifications with rigorous formwork control, "
                "certified rebar fixing and on-site batching where required. "
                "Sigma's structural crews work alongside our canal and "
                "roadworks teams so that bridges, head-regulators and "
                "ancillary structures are delivered without slowing the "
                "parent project's schedule."
            ),
            image="/sigma/header.jpg",
            why_best=[
                "Bridge crews trained on WAPDA / NHA specifications",
                "On-site batching and tight formwork control on every pour",
                "Integrated with our roads & canals teams for seamless interfaces",
                "Track record on head-regulators and cross-drainage works",
            ],
            icon="Bridge",
            sort_order=2,
        ),
        dict(
            id="water-supply",
            title="Water Supply Networks",
            description=(
                "End-to-end water supply network construction with a focus "
                "on durability, hydraulic performance and community impact."
            ),
            long_description=(
                "Sigma builds water supply networks that last — from intake "
                "structures and trunk mains to distribution lines, valves "
                "and chambers. We handle pipe-laying in DI, MS and HDPE, "
                "along with thrust blocks, hydrostatic testing, chlorination "
                "and commissioning. Each scheme is delivered with a community "
                "impact lens so households see clean, pressurized water from "
                "day one."
            ),
            image="/sigma/header.jpg",
            why_best=[
                "Experience with DI, MS and HDPE pipe networks at municipal scale",
                "In-house hydrostatic testing and disinfection capability",
                "Community-impact mindset on every commissioning",
                "Coordinated civil + mechanical crews for chambers and valves",
            ],
            icon="Droplets",
            sort_order=3,
        ),
        dict(
            id="dams-barrages",
            title="Dams & Barrages",
            description=(
                "Heavy civil works for barrages, regulators and dam-related "
                "infrastructure executed with modern equipment and trained "
                "crews."
            ),
            long_description=(
                "Heavy civil works are where Sigma's plant and equipment fleet "
                "shows its value. We mobilize excavators, dump trucks, "
                "batching plants and pumps to execute earthworks, structural "
                "concrete and ancillary works for barrages, regulators and "
                "dam-related infrastructure. Our project managers are veterans "
                "of WAPDA-grade scopes and run weekly QC, safety and progress "
                "reviews directly with the client engineer."
            ),
            image="/sigma/header.jpg",
            why_best=[
                "Owned heavy plant fleet ready for remote mobilization",
                "Senior project managers with WAPDA / large-canal background",
                "Weekly QC, safety and progress cadence with client engineers",
                "Strong HSE record on long-duration heavy-civil scopes",
            ],
            icon="Mountain",
            sort_order=4,
        ),
        dict(
            id="civil-turnkey",
            title="Civil Engineering & Turnkey Construction",
            description=(
                "Residential, commercial and industrial turnkey works "
                "delivered with experienced engineers and rigorous quality "
                "assurance."
            ),
            long_description=(
                "Sigma's turnkey arm handles the full lifecycle of "
                "residential, commercial and industrial buildings — design "
                "coordination, structural and architectural works, MEP, "
                "finishes and handover. Each project is led by a dedicated "
                "PM, supported by experienced engineers and a defined QA/QC "
                "checklist so the client can move in or operate from day one "
                "without snag chaos."
            ),
            image="/sigma/header.jpg",
            why_best=[
                "Single point of accountability from design to handover",
                "Experienced engineers across structural, architectural and MEP",
                "Defined QA/QC checklists so handover is genuinely turnkey",
                "Comfortable with residential, commercial and industrial scopes",
            ],
            icon="HardHat",
            sort_order=5,
        ),
    ]
    return [Service(**r) for r in rows]

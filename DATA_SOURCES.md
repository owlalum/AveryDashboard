# Data Sources Documentation

All data in the Avery College Planning Dashboard was researched and compiled between February and March 2026. Each data object below documents field-level sourcing, verification dates, and annual volatility.

---

## schoolDB

Core school profiles used across comparison, financial, and ranking views.

| Field | Primary Source | Secondary Source | Last Verified | Changes Annually? |
|-------|---------------|-----------------|---------------|-------------------|
| `location` | School website | -- | 2026-03-06 | No |
| `tuitionIn` | School bursar / tuition page | Common Data Set (CDS) Section G | 2026-03-06 | **Yes** — typically updated each June-August for the coming academic year |
| `tuitionOut` | School bursar / tuition page | CDS Section G | 2026-03-06 | **Yes** — same cycle as in-state tuition |
| `deadline` | School admissions page | Common App school profile | 2026-03-06 | **Yes** — some schools shift deadlines slightly year over year |
| `earlyDecision` | School admissions page | Common App school profile | 2026-03-06 | **Yes** — EA/ED dates can change |
| `testReq` | School admissions page (middle 50% ranges) | CDS Section C | 2026-03-06 | **Yes** — ranges shift with each incoming class |
| `acceptRate` | CDS Section C7 | US News & World Report | 2026-03-06 | **Yes** — published each fall for prior cycle |
| `oosAcceptRate` | CDS Section C7 (where available) | School institutional research | 2026-03-06 | **Yes** — follows same cycle as overall accept rate |
| `avgGPA` | CDS Section C11-C12 | School admissions profile | 2026-03-06 | **Yes** — shifts with each class |
| `usNewsOverall` | US News Best National Universities 2025 | -- | 2026-03-06 | **Yes** — new rankings published each September |
| `usNewsPublic` | US News Best Public Universities 2025 | -- | 2026-03-06 | **Yes** — same September cycle |
| `vetSchoolRank` | US News Best Veterinary Schools 2025 | AVMA accreditation list | 2026-03-06 | **Yes** — vet school rankings update annually |
| `notes` | School department websites, CVM pages | Campus visits, information sessions | 2026-03-06 | Occasionally — honors requirements and program details can change |
| `domain` | School website | -- | 2026-03-06 | No |
| `color` | School brand guidelines | -- | 2026-03-06 | No |
| `lastVerified` | (Tracking field) | -- | 2026-03-06 | N/A — updated when data is re-verified |

### Re-verification priority (do these first each summer)
1. **Tuition** (in-state and out-of-state) — biggest financial planning impact
2. **Deadlines** (regular and early) — time-sensitive for application planning
3. **Accept rates & test ranges** — affects school tiering (safety/match/reach)
4. **US News rankings** — September release; update after publication

---

## FIN_DATA

Financial analysis data: annual sticker prices and estimated merit aid by school.

| Field | Primary Source | Secondary Source | Last Verified | Changes Annually? |
|-------|---------------|-----------------|---------------|-------------------|
| `school` | -- | -- | 2026-03-06 | No |
| `res` (residency) | Family information | -- | 2026-03-06 | No (unless residency changes) |
| `sticker` | School Cost of Attendance pages (tuition + room/board + fees) | College Navigator (NCES) | 2026-03-06 | **Yes** — COA updates each summer |
| `merit` | School merit scholarship pages | Scholarship search tools, campus visit info | 2026-03-06 | **Yes** — merit thresholds and amounts change; some are ACT/GPA-dependent |
| `notes` | School financial aid pages | -- | 2026-03-06 | Varies |
| Category tier (Safety/Match/Reach) | Calculated from accept rates and test ranges | -- | 2026-03-06 | **Yes** — re-evaluate after accept rate updates |

### Re-verification priority
1. **Sticker prices** — recalculate from updated COA each July-August
2. **Merit aid amounts** — check for threshold changes; Kentucky merit is ACT-tier-dependent and auto-calculated in the dashboard
3. **Tier assignments** — revisit after new acceptance rate data

---

## GREEK_LIFE_DATA

Sorority and Greek life statistics for each school.

| Field | Primary Source | Secondary Source | Last Verified | Changes Annually? |
|-------|---------------|-----------------|---------------|-------------------|
| `pctWomen` | School Greek life office / annual report | Fraternity & Sorority Life websites | 2026-03-06 | **Yes** — participation rates shift |
| `npc` (NPC chapter count) | National Panhellenic Conference | School PHA council | 2026-03-06 | Occasionally — new chapters colonize every few years |
| `total` (total sorority orgs) | School student affairs / Greek life page | -- | 2026-03-06 | Occasionally |
| `recruitment` | School PHA recruitment page | -- | 2026-03-06 | Rarely — structural timing changes are uncommon |
| `housing` | School Greek life page, campus housing | Campus visits | 2026-03-06 | Rarely |
| `cost` | School PHA council, chapter websites | Reddit / Greek life forums | 2026-03-06 | **Yes** — dues and housing costs adjust annually |
| `greekPct` | School institutional data / CDS | Greek life annual reports | 2026-03-06 | **Yes** — overall Greek participation fluctuates |
| `gpa` | School Greek life GPA reports | Panhellenic grade reports | 2026-03-06 | **Yes** — semester-by-semester |
| `vibe` | Campus visits, student reviews, Reddit | College guidebooks | 2026-03-06 | Rarely — cultural feel is slow-moving |

### Re-verification priority
1. **Cost** — dues change annually; affects budgeting
2. **Participation rates** (`pctWomen`, `greekPct`) — useful context but low decision impact
3. **Chapter counts** — only when a new colonization is announced

---

## STRATEGY_DATA

Admission strategy intelligence: how each school routes applicants to colleges/majors.

| Field | Primary Source | Secondary Source | Last Verified | Changes Annually? |
|-------|---------------|-----------------|---------------|-------------------|
| `type` (admission model) | School admissions FAQ / process page | CDS Section C | 2026-03-06 | Rarely — structural admission changes are uncommon |
| `overall` (overall accept rate) | CDS Section C7 | US News | 2026-03-06 | **Yes** — new data each fall |
| `advantage` | Analysis of CDS data, college-specific accept rates | School institutional research, ABPA dashboards | 2026-03-06 | **Yes** — relative advantage can shift |
| `advDetail` | CDS college-level breakdowns, school factbooks | Freedom of Information requests, Reddit | 2026-03-06 | **Yes** — detailed rates shift with each cycle |
| `major` | School catalog, department pages | -- | 2026-03-06 | Rarely — major names occasionally change |
| `track` | Department advising pages, pre-vet office | Campus visit info sessions | 2026-03-06 | Occasionally — concentrations get renamed or restructured |
| `backup` | School application instructions | Common App school-specific questions | 2026-03-06 | Rarely |

### Re-verification priority
1. **Overall accept rate** — re-derive from new CDS each fall
2. **Advantage detail** — check if college-level rates have shifted
3. **Major/track names** — verify against current catalog before application season

---

## SCHOOL_CHECKLISTS

Application checklists with deadlines, requirements, and tasks per school.

| Field | Primary Source | Secondary Source | Last Verified | Changes Annually? |
|-------|---------------|-----------------|---------------|-------------------|
| `text` (item description) | School admissions requirements page | Common App / ApplyTexas / Coalition | 2026-03-06 | **Yes** — requirements change each cycle |
| `cat` (category) | Derived from item content | -- | 2026-03-06 | N/A — internal classification |
| Deadline items | School admissions page | Common App school profile | 2026-03-06 | **Yes** — dates shift year to year |
| Application fee items | School admissions page | -- | 2026-03-06 | **Yes** — fees occasionally increase |
| Test requirement items | School admissions page | CDS | 2026-03-06 | **Yes** — test-optional policies evolve |
| Scholarship items | School financial aid / scholarship page | -- | 2026-03-06 | **Yes** — deadlines and eligibility criteria change |
| Honors items | School honors college website | -- | 2026-03-06 | **Yes** — honors requirements and deadlines change |
| FAFSA/CSS items | School financial aid page | -- | 2026-03-06 | Rarely — FAFSA timing is federally set |
| Program items | Department / pre-vet advising pages | -- | 2026-03-06 | Occasionally |

### Re-verification priority
1. **Deadlines** — critical; verify all dates in August before application season opens
2. **Test requirements** — test-optional landscape still shifting post-COVID
3. **Scholarship deadlines and criteria** — missing a scholarship deadline has real cost
4. **Honors applications** — separate deadlines and requirements from main app

---

## SCHOOL_ESSAYS

Essay prompts, word counts, and requirements per school.

| Field | Primary Source | Secondary Source | Last Verified | Changes Annually? |
|-------|---------------|-----------------|---------------|-------------------|
| `name` (essay title) | School application portal, Common App | -- | 2026-03-06 | **Yes** — prompts often change each cycle |
| `words` (word limit) | School application portal | Common App / Coalition | 2026-03-06 | **Yes** — word limits can change |
| `prompt` | School application portal (current cycle) | Prior year prompts as baseline | 2026-03-06 | **Yes** — many schools revise prompts annually |
| `required` | School application instructions | Common App requirements | 2026-03-06 | **Yes** — optional vs. required status can flip |

### Re-verification priority
1. **All fields** — essay prompts are the most volatile data in the dashboard. Most schools release new prompts between June and August. **Every prompt must be re-verified before Avery starts writing.**
2. Common App personal statement prompts are more stable but still check annually (last changed 2023-24)
3. Honors essay prompts — often released later than main application essays

---

## Annual Maintenance Calendar

| When | Action |
|------|--------|
| **June** | Check for new tuition/COA postings; watch for Common App prompt updates |
| **July** | Verify sticker prices, merit aid amounts, and scholarship criteria for all 21 schools |
| **August** | Verify all deadlines (regular, EA/ED, scholarship, honors); confirm essay prompts are current; update test score ranges from new CDS releases |
| **September** | Update US News rankings (overall, public, vet school) after annual publication |
| **October** | Final pre-application audit: spot-check all active school data against live admissions pages |
| **Post-cycle (April+)** | Update accept rates and GPA ranges from newly published CDS data |

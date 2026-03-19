# Annual Data Review Guide

This document outlines when and how to re-verify the dashboard's data each year. For detailed field-level sourcing, see [DATA_SOURCES.md](DATA_SOURCES.md).

---

## Maintenance Calendar

| When | Action |
|------|--------|
| **June** | Check for new tuition/COA postings; watch for Common App prompt updates |
| **July** | Verify sticker prices, merit aid amounts, and scholarship criteria for all 21 schools |
| **August** | Verify all deadlines (regular, EA/ED, scholarship, honors); confirm essay prompts are current; update test score ranges from new CDS releases |
| **September** | Update US News rankings (overall, public, vet school) after annual publication |
| **October** | Final pre-application audit: spot-check all active school data against live admissions pages |
| **Post-cycle (April+)** | Update accept rates and GPA ranges from newly published CDS data |

---

## Data Objects by Volatility

### High volatility (verify every cycle)
- **SCHOOL_ESSAYS** — prompts, word limits, and required status change most frequently. Every prompt must be re-verified before Avery starts writing.
- **SCHOOL_CHECKLISTS** — deadlines, fees, test policies, scholarship criteria, and honors requirements all shift year to year.
- **FIN_DATA** — sticker prices and merit aid amounts update each summer.

### Medium volatility (verify annually)
- **schoolDB** — tuition, accept rates, test ranges, GPA, and US News rankings all update on known schedules. Deadlines can shift slightly.
- **STRATEGY_DATA** — overall accept rates change each fall; college-level advantage details may shift; major/track names occasionally change.

### Low volatility (verify occasionally)
- **GREEK_LIFE_DATA** — dues/costs change annually but participation rates, chapter counts, housing, and cultural vibe are slow-moving. Check costs in July; spot-check the rest.

---

## How to Update

1. Update the data values in `index.html` within the relevant data object
2. Set the `lastVerified` field on the schoolDB entry to the current date
3. Update the "Last Verified" column in [DATA_SOURCES.md](DATA_SOURCES.md) if doing a full-object refresh

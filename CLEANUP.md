# Cleanup TODO

Inventory of code intentionally left in place after recent refactors. Nothing
here is broken — this is a future-pass tracker so we don't lose sight of
what's safe to delete once the new behavior is validated.

## v20 — Visit form simplification

The Visits tab evaluation form was simplified from 31 weighted ratings + 12
free-text fields to 3 ratings + 2 short text fields (`overallFit`,
`campusVibe`, `academicFit`, `loved`, `concerned`). The legacy code paths are
no longer reachable from the UI, but the functions are kept for now so the
"Restore from legacy" feature and any backup/restore flows that still
reference the old shape continue to work.

### Dead functions in `index.html` (still defined, no live callers)

- `renderEvalSchoolPicker()` — populated the old `<select id="evalSchoolSelect">` dropdown, which has been removed from the HTML.
- `renderEvalSummary()` — rendered the `<tbody id="evalSummaryBody">` summary table, also removed from the HTML.
- `toggleEvalSection(header)` — collapse/expand toggle for the old per-category accordion.
- `expandAllEvalSections()` / `collapseAllEvalSections()` — bulk controls for the old accordion.
- `setEvalRating(school, catKey, itemKey, val)` — wrote into the old per-category rating subobjects.
- `setEvalField(school, field, val)` — wrote into top-level legacy fields (`visitDate`, `weather`, `tourGuide`, `letterGrade`).
- `setEvalIntangible(school, field, val)` — wrote into the old `intangibles` block.
- `setVisitNote(school, field, val)` — wrote into the parallel `data.visitNotes` store.
- `calcCategorySubtotal(evalData, catKey)` — only called by `renderEvalSummary` and the legacy `calcWeightedTotal`.
- `calcWeightedTotal(evalData)` — the old 31-rating × 5 × per-category-weight aggregator. Replaced by `calcNewVisitScore` for ranking, and not called from any live code path.
- `calcMaxWeightedTotal()` — only used by the dead `calcWeightedTotal` consumers.

These can all be deleted in a follow-up pass once we're confident the v20
form is stable and no backup/restore flows need to read the old shape.

### Stale CSS selectors

These rules style elements that no longer render. Safe to remove with the
functions above.

- `#evalSummaryBody td:first-child` and related sticky-cell rules
- `.eval-school-picker`, `.eval-section`, `.eval-section-header`, `.eval-section-body`, `.eval-row`, `.eval-stars`, `.eval-text`, `.eval-grade-picker`, `.eval-chevron`, `.eval-collapsed`, `.eval-total-bar`, `.weight-badge`, `.subtotal`, `.total-score`, `.total-label`
- `.visit-notes-section`, `.visit-notes-prompt`

### `data.visitNotes` store

The whole `data.visitNotes[name]` parallel store is no longer read or
written by the live UI. Its useful fields (`loved`, `concerned`) were rolled
into `data.evaluations[name].loved` / `.concerned` during the v20 migration,
and the entire object is preserved inside
`data.evaluations[name].legacyVisitData.visitNotes`. The top-level
`data.visitNotes` map can be deleted once we're confident no
backup/restore code reads it.

### `data.evaluations[name].legacyVisitData`

Per-school snapshot of the pre-v20 evaluation + visitNotes record. Kept so
the "Restore from legacy" button can re-apply the migration mapping if a
school's mapping turns out wrong. After the family confirms all migrated
schools are accurate, this blob can be cleared (set to `null` per school) to
slim down the stored data. There is no UI to clear it in v20 — set it
manually via the console or in a future cleanup pass.

## v20.1 — Visits tab nav cleanup

The "Tour Checklist" and "Visit Log — March 2026" subtab buttons were
removed from the Visits group nav since the March 2026 trip is complete and
neither view is actionable for fall application decisions. The sub-panels
(`#tourchk` and `#roadtrip`) and their data stores are intact and reachable
via the Archive footer at the bottom of the Evaluation panel.

If we get to a point where the road trip data is no longer useful as
reference and we're confident we won't re-surface these panels:

- HTML: delete the `#tourchk` and `#roadtrip` `<div>`s in the Visits group.
- Renderers: delete `renderTourChecklist()` and `renderRoadTrip()`.
- Initialization: delete `getTourChecklist()` and the `TOUR_CHECKLIST_SECTIONS` constant.
- `TRIP_DAYS` constant: delete (hardcoded itinerary).
- `data.tourChecklist` and `data.tripNotes` stores: delete via console once you're sure.
- Archive footer (`<details class="visit-archive">`) in `#evaluation`: delete.
- `ARCHIVED_SUBTABS` set + the guard in `restoreTab()`: delete.
- CSS for `.visit-archive`, `.archive-back-link`, `.archive-badge`: delete.

## Anything I should add here

When you finish a refactor and leave dead code behind on purpose, drop a
line here so it doesn't rot indefinitely. One bullet per dead symbol or
schema field is fine.

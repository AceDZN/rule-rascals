# Campaign appearance review — 2026-10-28

Seven environment themes now support the 35-level campaign. The existing raccoon, guard and watering-helper GLBs are reused. Chapter scenery is original Three.js geometry; this pass used no image generation, Tripo generations or credits.

## Scope of the evidence

These are **appearance fixtures, not earned campaign completions**. Each chapter capture used an isolated Playwright browser profile with the preceding completion records seeded into `rule-rascals-campaign-v2`. The map fixture seeded records 0–33, with `assisted: true` and `languageEvidence: false`, to expose every node. This changes only those disposable browser profiles. It does not establish gameplay success, student language evidence, difficulty, duration or learning gains.

The chapter script then used normal start/resume, pointer movement and badge-equipping inputs, with the game's deterministic time hook. It captured entry and central views at levels 1, 6, 11, 16, 21, 26 and 31. All seven finished in play mode with the three local GLBs loaded and no uncaught page errors. The station fixture first approaches the badge directly so its new nearby service point cannot intercept the equip input.

## Environment review

| Chapter | Visible identity | Reviewed sample |
| --- | --- | --- |
| Exhibition Garden | Warm cream/jade stone, foliage, trellises and topiary; pergola backdrop | [Entry](evidence/campaign-themes/1-garden-entry.png), [center](evidence/campaign-themes/1-garden-center.png) |
| The Glasshouse | Pale botanical palette, small glasshouse frames, seed bottles and domed backdrop | [Entry](evidence/campaign-themes/2-glasshouse-entry.png), [center](evidence/campaign-themes/2-glasshouse-center.png) |
| Robot Workshop | Brass/red gears, pipes, dark posts and factory/chimney silhouette | [Entry](evidence/campaign-themes/3-workshop-entry.png), [center](evidence/campaign-themes/3-workshop-center.png) |
| Exhibition Station | Luggage canopies, clock, parcel displays, platform lamps and train backdrop | [Entry](evidence/campaign-themes/4-station-entry.png), [center](evidence/campaign-themes/4-station-center.png) |
| The Museum Wing | Plum/ivory palette, plinth sculptures, framed geometric art and colonnade | [Entry](evidence/campaign-themes/5-museum-entry.png), [center](evidence/campaign-themes/5-museum-center.png) |
| Rooftop Run | Cool blue-gray stone, visible HVAC grilles/fans, antennas and city skyline | [Entry](evidence/campaign-themes/6-rooftop-entry.png), [center](evidence/campaign-themes/6-rooftop-center.png) |
| Festival Night | Colored pennants, lanterns, warm stage lights and a stage backdrop | [Entry](evidence/campaign-themes/7-festival-entry.png), [center](evidence/campaign-themes/7-festival-center.png) |

The raccoon silhouette, rule pin, current objective and west/east/dispatch markers remain readable in the inspected entry and central views. The industrial chapters have clear solid silhouettes distinct from the leafy chapters. Glasshouse and garden deliberately share foliage; their difference is subtler at the central camera than workshop, museum or rooftop. Festival uses bright twilight colors so rule reading and character visibility remain practical.

All themes preserve the shared navigation footprint and recognizable fountain. Dressing stays within existing planter/shelf/fountain/boundary-site footprints or beyond the walk bounds. Non-tree chapters replace boundary trees with visible posts on the same bases. A geometry inspection checks actual world-space XZ bounds, not nominal primitive sizes. All seven pass containment with zero violations; static dressing uses 5–9 material batches per chapter. This is a placement check, not a substitute for the campaign's independent collision and route tests.

## Campaign map

The unlocked fixture contains **35 level buttons in seven chapter sections** at both 1440×900 desktop and 390×844 touch-mobile sizes. There is no horizontal page overflow, sheet overflow or overflowing node text. The map intentionally scrolls vertically inside its sheet. Level 35 and the back button are visible at the bottom; no node is clipped horizontally. Hebrew titles wrap within the narrow mobile buttons.

| Profile | Top | Bottom | Sheet width / scroll width | Result |
| --- | --- | --- | --- | --- |
| Desktop, 1440×900 | [Capture](evidence/campaign-themes/map-desktop-top.png) | [Capture](evidence/campaign-themes/map-desktop-bottom.png) | 780 / 780 px | 35 nodes, 7 chapters, level 35 reachable |
| Mobile, 390×844 | [Capture](evidence/campaign-themes/map-mobile-top.png) | [Capture](evidence/campaign-themes/map-mobile-bottom.png) | 350 / 350 px | 35 nodes, 7 chapters, level 35 reachable |

The screenshots' completion stars and 34/35 summary are seeded fixture data. They are not classroom or game-completion results. Both map profiles reported zero page errors.

## Long mobile task sheet and target selector

A fresh 390×844 level-35 appearance fixture additionally checks the longest mission sheet. All 11 task entries wrap within the 350 px sheet, and the resume button is reachable at the bottom. The nearby-object selector fits within the viewport (x=234, width=141 px), showing the readable `Visitor badge · 1.8 m` option. This was a layout check, not a test of the native select menu or every alternate-target action.

- [Sheet as opened](evidence/campaign-themes/mobile-level35-rules-opened.png)
- [Sheet top after scrolling to its beginning](evidence/campaign-themes/mobile-level35-rules-top.png)
- [Eleven tasks and resume button](evidence/campaign-themes/mobile-level35-rules-bottom.png)
- [Gameplay and nearby target selector](evidence/campaign-themes/mobile-level35-near-target.png)
- [Measurements and state](evidence/campaign-themes/mobile-long-task-report.json)

Two issues were found and reported to the lead: the long sheet initially scrolled 1004 px down to its first button, and the late-campaign chapter header wrapped behind the rule pin. The lead fixed modal focus/scroll and added a deliberate two-row mobile header. A fresh fixture on dev port 5203 verified `openedScrollTop: 0`, a 13.17 px gap from the chapter row to the rule pin, all 11 tasks and the resume button reachable, and zero uncaught page errors. The latest linked captures show the corrected result; [initial sheet](evidence/campaign-themes/mobile-before-fix-rules-opened.png) and [initial header](evidence/campaign-themes/mobile-before-fix-header.png) preserve the earlier observations. The production preview on 4203 was intentionally kept frozen for the lead's separate campaign playthrough during these source fixes. This review edited no scene or UI source.

## Integration and reproducibility

`src/campaign-theme.ts` exports `CHAPTER_THEMES`, `getChapterTheme(index)`, `createChapterDressing(index)` and `disposeChapterDressing(group)`. Themes provide captions, eight scene colors, four paving colors, background/sun colors and foliage/boundary-tree flags. The returned group contains static decorative meshes and placement metadata, with no DOM, game loop, collision state or asset loading. The scene selects `Math.floor(level / 5)` and owns the theme lifecycle.

- [Chapter state/error report](evidence/campaign-themes/visual-fixture-report.json)
- [Map measurements/error report](evidence/campaign-themes/map-visual-report.json)
- [Geometry containment report](evidence/campaign-themes/placement-report.json)
- Reproduction scripts: `work/qa-campaign-themes.cjs`, `work/qa-campaign-map-visual.cjs`, `work/qa-campaign-mobile-long-task.cjs`, `work/inspect-chapter-dressing.ts` (local ignored work files).

`npm run typecheck` passed after the theme integration and fixture checks. Geometry containment passed for all seven themes.

## Repeated scene lifecycle

An isolated component fixture on dev port 5203 created one canvas/view and called `createGame`/render through levels 0–34 twice. This is a rendering lifecycle check, **not a gameplay-completion run**. It first exposed procedural robot resources left resident after removal: final-level geometry count increased from 2678 to 5138 between cycles. The lead added ownership-specific disposal for item geometry, station-light materials and procedural actor fallbacks; shared GLB template buffers remain alive.

The same two-cycle fixture after those fixes ends at **202 geometries, 18 textures and 15 programs in both passes**, with a maximum of 202 / 18 / 16 across all 70 samples. Matched levels 5–35 have exactly equal geometry counts. Levels 1–4 retain two additional persistent backpack geometries in pass two, first uploaded at level 5 of pass one; this is bounded warm residency. An initial strict equality assertion was corrected to account for those two persistent meshes, then the captured measurements passed the bounded-residency assertions without a redundant replay. All samples retain the actual skinned raccoon and at least two rigid GLB actor roots, and there are zero uncaught page or console errors. The final screenshot was opened and confirms the acquired actors continue rendering.

Local reproduction and measurements remain in ignored work files: `work/qa-render-lifecycle.cjs`, `work/render-lifecycle-report.json` (including source SHA-256 values), `work/render-lifecycle.log` and `work/lifecycle-cycle-2.png`. Original failure evidence is preserved in `work/lifecycle-before-fix/`. No game source was edited by this review.

Remaining limits: the seven chapters share one authored footprint, the existing conservatory/store structure and the acquired actors. This pass verifies sampled appearance and map layout; it does not claim every level was completed or that every camera position was inspected. Full campaign progression, persistence and English-content verification are recorded separately by the lead and independent reviewer.

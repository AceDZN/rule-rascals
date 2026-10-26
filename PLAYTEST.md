# Verification record

26 October 2026, local desktop. The original procedural baseline is preserved in progress.md and older captures. This is the resumed pass with actual local Tripo assets. Browser actions use ordinary pointer, keyboard and touch input plus the public deterministic time hook; no level, inventory or win state is injected.

## Player-reported physics and locomotion fixes

The user reproduced walking through the entry desk, signs sliced by conservatory ribs and a floating-looking raccoon after pickup. Earlier click-route/clip-name checks missed those issues. This follow-up adds actual held-key contact tests and sustained carry/stop/resume motion inspection.

Scenery rendering and collisions now share authored dimensions. Desk, arch posts, pots, tree bases, shelf, fountain lip and bell pedestals are solid; the actor disc stays inside platform bounds. Ground bags, boxes and trolleys have dynamic footprints, removed on pickup. Drop placement stays on free reachable floor beside the carrier. Click navigation approaches furniture rather than entering it, validates full path segments and follows corners closely. A blocked actor reports zero actual movement speed. Slightly shifted token/bell/box positions keep them clear of the real fountain footprint without changing their identities/history.

Signs draw above the framing and remain readable while architecture fades. The custom carry export stopped stepping late in its loop; actual walk legs now combine with its carry upper body, with a separate supported idle carry stance. Animation rate follows actual displacement. No arbitrary vertical model offset was applied. Continuous frame/video evidence and measured foot support are documented in docs/asset-evidence/raccoon-locomotion-fix.md. Chasing guards pursue the last observed position when cover blocks sight.

Fresh final five-job runs pass both with and without trolley, all with lawful=true, languageEvidence=true and zero page errors. The bell route uses real cover and a second finite distraction after waiting for the toy cooldown. The independent direct-input browser completes lawful H1 plus the H2 ground-bag pickup/drop loop. Its desktop collision/label/carry scope is distinct from earlier touch/settings checks. Curated follow-up captures use the `fixed-` prefix.

## Current automated checks

- `npm test`: **71 / 71** semantic and physics cases pass. The earlier 41 semantic assertions remain (two fixtures now use free floor), plus 15 scenery, 13 bulky-prop/drop and two chase-memory regressions. Earlier coverage includes ten independent H1 cases for stationary watched-token carrying, actual distraction/expiry, physical cover, non-carrying ground objects, lawful no-toy eligibility, action versus language evidence, unchanged H2 optional-map choices and frozen reading pressure.
- `npm run typecheck` and `npm run build`: pass. Vite reports its normal large-chunk advisory for Three.js; the build succeeds.
- Static production preview runs on 4203 and development on 5203, both strictPort. No production deployment was performed.
- Binary and actual rendered inspection verifies three original local GLBs,65 Mixamo joints and four real clips. Root translation normalization, idle→walk→run→carry transitions and hand sockets were checked in an isolated Three.js browser. See ASSETS.md and docs/asset-evidence.

## Actual browser paths after integration

The lead replayed all five jobs repeatedly with all three models loaded, including both trolley choices and a final 1672×941 run matching the generated targets. Every job reached its actual success sheet. The successful runs returned lawful=true and languageEvidence=true separately from action completion, with zero page errors. They are fast automated routes, excluding student reading/planning time.

| Path | Observed result |
| --- | --- |
| H1 watched token | Read rules, wear badge, distract before taking token, route around cover, return to exit. Independent lawful completion at 15.6 s, retries 0; exact conditional pin verified in the DOM. |
| H2 optional map | Lead took map and opened paused visited-route view; independent earlier run skipped it. Both branches remain lawful. The new H1 restriction does not apply to this job. |
| H3 helper | Observe and request the actual watering helper, approach gate, enter together, carry store token and exit. The sweeper cannot satisfy the helper condition in semantic checks. |
| H4 key/history/stealth | Inspect both keys and bell histories, unlock through the side-door key, take the polished bell, use finite distraction and cover, exit. Both shuffled bell placements were exercised. Pin changes from key instruction to watched-bell condition after unlocking. |
| H5 transfer | Visible large backpack is left outside; correct box is identified from placement history; watering helper receives it and transports that cargo through the arch. Full runs passed with and without trolley. Visitor badge alone never grants the helper role. |
| Chase → distraction → cover | Independent deliberate watched-token breach produced chase at t=8.00. Space changed actual guard state, suppressed cone/meter and displayed a readable '?' plus sound rings. Cover returned play with suspicion0; the earlier breach still prevents first unaided language credit. |
| Catch → retry | Reviewer approached for an actual catch, then retry returned play, cargo=null and retries 1. Hint reading froze time 25.73→25.73; restart returned intro with retries 2. |
| Touch 390×844 / 844×390 | All3 models loaded; real taps equipped badge, dragged the pad, toggled sneak and reached the token. Pause froze time 7.50→7.50. No page errors or document overflow. Dynamic rule/mission spacing and a short-landscape toast placement correction keep text separate from controls. |
| Desktop controls | Pause/resume, reduced motion, mute, restart and fullscreen on/off pass with zero page errors. The checker waits for actual fullscreen transitions. |
| Installed web-game client | The unchanged installed action/capture/state client ran through scripts/run-skill-native.mjs after meaningful changes. Final gameplay state shows all 3 models,65 joints, badge equip, movement and squeak. Its actual image was opened and inspected. |

Curated final captures use the `rigged-` prefix in docs/evidence. Earlier procedural and pre-asset captures remain clearly separate. Independent review details and limitations are in docs/ENGLISH_REVIEW.md.

## Repeatable commands

```sh
npm test
npm run typecheck
npm run build
npm run dev
# Separate terminal:
npm run preview
node --import tsx scripts/qa-browser.cjs
node --import tsx scripts/qa-browser.cjs --trolley
node scripts/qa-physical.cjs
node scripts/qa-controls.cjs
node scripts/qa-performance.cjs
```

Install the project's browser with `npx playwright install chromium` where needed. On this desktop, the skill's installed compatible Playwright was used through `RULE_RASCALS_BROWSER_LIB=/Users/acedzn/.codex/skills/develop-web-game/node_modules/playwright`, since the project browser revision was absent. `RULE_RASCALS_URL` selects another local URL. Test browsers are isolated Chromium instances, never the user's signed-in Chrome profile.

The installed skill client initially stalled with its SwiftShader configuration on this host. scripts/run-skill-native.mjs imports that unchanged client with native Metal launch flags and longer transport timeouts. `?deterministic=1` renders from the same advanceTime hook while avoiding continuous GPU redraw between actions. The full-flow runner chooses visible ground waypoints from read-only geometry and sends pointer input; it never mutates the authoritative simulation.

## Measured production performance

Native Metal headless Chromium, 1280×800, DPR 1, all three models loaded, normal continuous RAF, five-second sample:

- 601 frames in 5002.5 ms: **120.14 fps**. Game's smoothed hook reported 117 fps.
- **4,132,305 encoded resource bytes** plus the small HTML document, including **3,870,084 model bytes**. Each model is below 3 MB; initial resources are below 20 MB.
- Production JS approximately 706 kB raw / 187 kB build gzip estimate; CSS approximately 19 kB raw.
- Zero page errors. These are local desktop measurements, not a low-end phone benchmark or sustained minimum. This sample uses the final collision/locomotion build with normal guard patrols running.

## Practical limits

The commissioned raccoon rig and real local model/animation integration are now present. Carrying uses the actual generated full-body motion, with hands at waist/lower chest; it is not a perfect high two-hand constraint. Wheeled robots are rigid props and their wheels/lids do not articulate. The sweeper, bells, boxes, architecture and foliage remain original authored geometry. Target art is more cinematic and detailed than this playable garden diorama; VISUAL_REVIEW.md records that difference.

No classroom study has established fun, learning gains or a six-to-ten-minute session duration. Automated routes exclude reading time. English speaking output depends on installed system voices; no speech assessment is claimed. Touch was checked at 390×844, not across every device or assistive technology. Local URLs require the running servers.
